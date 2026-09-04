import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import type { NextRequest } from 'next/server';
import type { Conversation, Message, UUID } from '@healverse/application';
import { ConversationType, MessageRole, MessageStatus, SupportedLanguage, Theme, type ISODateString } from '@healverse/shared';
import { createConversationItemHandlers, createConversationMessagesHandlers, createConversationsCollectionHandlers, type ApiRuntime } from '@/lib/server/api';

function createMockRequest(url: string, method: string, body?: unknown, headers?: Record<string, string>): NextRequest {
  return {
    method,
    headers: new Headers({
      'content-type': 'application/json',
      'x-request-id': 'test-request-id',
      ...headers,
    }),
    nextUrl: new URL(url),
    json: async () => body,
  } as unknown as NextRequest;
}

function createMockRuntime(defaultUserId: string = '22222222-2222-4222-8222-222222222222'): ApiRuntime {
  const conversations = new Map<string, Conversation>();
  const messages = new Map<string, Message[]>();

  const baseConversation: Conversation = {
    id: '11111111-1111-4111-8111-111111111111' as UUID,
    title: 'Medication follow-up',
    type: ConversationType.General,
    summary: null,
    messageIds: [],
    participantIds: ['22222222-2222-4222-8222-222222222222' as UUID],
    preferences: {
      theme: Theme.System,
      language: SupportedLanguage.EnglishUS,
      sendWithEnter: true,
      compactMode: false,
      allowAttachments: true,
    },
    createdAt: '2026-08-30T00:00:00.000Z' as ISODateString,
    updatedAt: '2026-08-30T00:00:00.000Z' as ISODateString,
  };

  conversations.set(baseConversation.id, baseConversation);
  messages.set(baseConversation.id, []);

  const logger = {
    debug: () => undefined,
    info: () => undefined,
    warn: () => undefined,
    error: () => undefined,
  };

  const authAdapter = {
    async getSession(headers?: Headers) {
      if (headers?.get('x-no-auth') === 'true') {
        return null;
      }
      const userId = headers?.get('x-user-id') ?? defaultUserId;
      return {
        user: {
          id: userId,
          name: 'Test User',
          email: 'test@example.com',
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        session: {
          id: 'mock-session-id',
          sessionId: 'mock-session-id',
          userId,
          token: 'mock-token',
          expiresAt: new Date(Date.now() + 86400000),
        },
      };
    },
    async signOut() {},
    getAuth: () => ({} as never),
  };

  return {
    container: { authAdapter } as never,
    logger,
    services: {
      conversationService: {
        async createConversation(input) {
          const conversation: Conversation = {
            id: '33333333-3333-4333-8333-333333333333' as UUID,
            title: input.title ?? 'Untitled conversation',
            type: ConversationType.General,
            summary: null,
            messageIds: [],
            participantIds: [input.userId],
            preferences: baseConversation.preferences,
            createdAt: '2026-08-30T00:00:00.000Z' as ISODateString,
            updatedAt: '2026-08-30T00:00:00.000Z' as ISODateString,
          };
          conversations.set(conversation.id, conversation);
          messages.set(conversation.id, []);
          return conversation;
        },
        async deleteConversation(conversationId) {
          conversations.delete(conversationId);
          messages.delete(conversationId);
        },
        async renameConversation(input) {
          const existing = conversations.get(input.conversationId);
          if (!existing) {
            throw new Error('missing');
          }
          const updated = { ...existing, title: input.title };
          conversations.set(input.conversationId, updated);
          return updated;
        },
        async archiveConversation(conversationId) {
          const existing = conversations.get(conversationId);
          if (!existing) {
            throw new Error('missing');
          }
          const archived = { ...existing, archivedAt: '2026-08-30T00:00:00.000Z' as ISODateString };
          conversations.set(conversationId, archived);
          return archived;
        },
        async saveConversation(conversation) {
          conversations.set(conversation.id, conversation);
          return conversation;
        },
        async retrieveConversation(conversationId) {
          return conversations.get(conversationId) ?? null;
        },
      },
      aiService: {
        async generateConversationTitle() {
          return { title: 'Suggested title' };
        },
        async sendMessage(input) {
          const list = messages.get(input.conversationId) ?? [];
          const userMessage = input.message;
          list.push(userMessage);
          messages.set(input.conversationId, list);
          return { message: userMessage };
        },
        async receiveMessage(input) {
          return {
            message: {
              id: '44444444-4444-4444-8444-444444444444' as UUID,
              conversationId: input.conversationId,
              role: MessageRole.Assistant,
              status: MessageStatus.Sent,
              content: `Mock assistant response: ${input.message.content}`,
              attachments: [],
              createdAt: '2026-08-30T00:00:00.000Z' as ISODateString,
              updatedAt: '2026-08-30T00:00:00.000Z' as ISODateString,
            },
          };
        },
      },
      searchConversations: async ({ userId, query, page, pageSize }) => {
        const items = [...conversations.values()]
          .filter((conversation) => conversation.participantIds.includes(userId))
          .filter((conversation) => !query || conversation.title.toLowerCase().includes(query.toLowerCase()))
          .map((conversation) => ({
            id: conversation.id,
            conversationId: conversation.id,
            title: conversation.title,
            type: conversation.type,
            lastMessagePreview: messages.get(conversation.id)?.at(-1)?.content ?? conversation.title,
            messageCount: messages.get(conversation.id)?.length ?? 0,
            updatedAt: conversation.updatedAt,
          }))
          .slice((page - 1) * pageSize, page * pageSize);

        return { items, total: items.length, page, pageSize };
      },
      listConversationMessages: async ({ conversationId, page, pageSize }) => {
        const list = messages.get(conversationId) ?? [];
        const items = list.slice((page - 1) * pageSize, page * pageSize);
        return { items, total: list.length, page, pageSize };
      },
    },
  };
}

describe('conversation api handlers', () => {
  it('creates and lists conversations deriving userId strictly from session', async () => {
    const runtime = createMockRuntime();
    const handlers = createConversationsCollectionHandlers(runtime);

    // Client does NOT provide userId; server derives it from authenticated session
    const createResponse = await handlers.POST(
      createMockRequest('http://localhost/api/conversations', 'POST', {
        title: 'Care check-in',
      }),
    );

    assert.equal(createResponse.status, 200);
    const createBody = await createResponse.json();
    assert.equal(createBody.conversation.title, 'Care check-in');
    assert.deepEqual(createBody.conversation.participantIds, ['22222222-2222-4222-8222-222222222222']);

    const listResponse = await handlers.GET(createMockRequest('http://localhost/api/conversations?page=1&pageSize=10', 'GET'));
    assert.equal(listResponse.status, 200);
    const listBody = await listResponse.json();
    assert.equal(listBody.items.length >= 1, true);
    assert.equal(listBody.page, 1);
  });

  it('retrieves updates and deletes a conversation for authenticated participant', async () => {
    const runtime = createMockRuntime();
    const handlers = createConversationItemHandlers(runtime);

    const retrieveResponse = await handlers.GET(createMockRequest('http://localhost/api/conversations/11111111-1111-4111-8111-111111111111', 'GET'), {
      params: Promise.resolve({ conversationId: '11111111-1111-4111-8111-111111111111' }),
    });

    assert.equal(retrieveResponse.status, 200);

    const updateResponse = await handlers.PATCH(
      createMockRequest('http://localhost/api/conversations/11111111-1111-4111-8111-111111111111', 'PATCH', { title: 'Renamed care plan', archived: true }),
      { params: Promise.resolve({ conversationId: '11111111-1111-4111-8111-111111111111' }) },
    );

    assert.equal(updateResponse.status, 200);
    const updateBody = await updateResponse.json();
    assert.equal(updateBody.conversation.title, 'Renamed care plan');
    assert.equal(Boolean(updateBody.conversation.archivedAt), true);

    const deleteResponse = await handlers.DELETE(createMockRequest('http://localhost/api/conversations/11111111-1111-4111-8111-111111111111', 'DELETE'), {
      params: Promise.resolve({ conversationId: '11111111-1111-4111-8111-111111111111' }),
    });

    assert.equal(deleteResponse.status, 200);
  });

  it('rejects unauthenticated requests with 401 Unauthorized', async () => {
    const runtime = createMockRuntime();
    const handlers = createConversationsCollectionHandlers(runtime);

    const response = await handlers.GET(
      createMockRequest('http://localhost/api/conversations', 'GET', undefined, { 'x-no-auth': 'true' }),
    );
    assert.equal(response.status, 401);
    const body = await response.json();
    assert.equal(body.error.code, 'unauthorized');
  });

  it('rejects access from non-participant with 403 Forbidden', async () => {
    const runtime = createMockRuntime();
    const handlers = createConversationItemHandlers(runtime);

    // Request as different user (not participant in 11111111-1111-4111-8111-111111111111)
    const response = await handlers.GET(
      createMockRequest('http://localhost/api/conversations/11111111-1111-4111-8111-111111111111', 'GET', undefined, {
        'x-user-id': '99999999-9999-4999-8999-999999999999',
      }),
      { params: Promise.resolve({ conversationId: '11111111-1111-4111-8111-111111111111' }) },
    );

    assert.equal(response.status, 403);
    const body = await response.json();
    assert.equal(body.error.code, 'forbidden');
  });

  it('creates a message and returns a mock assistant reply', async () => {
    const runtime = createMockRuntime();
    const handlers = createConversationMessagesHandlers(runtime);

    const response = await handlers.POST(
      createMockRequest('http://localhost/api/conversations/11111111-1111-4111-8111-111111111111/messages', 'POST', { content: 'I need a follow-up reminder.' }),
      { params: Promise.resolve({ conversationId: '11111111-1111-4111-8111-111111111111' }) },
    );

    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.message.role, 'user');
    assert.equal(body.assistantMessage.role, 'assistant');

    const historyResponse = await handlers.GET(
      createMockRequest('http://localhost/api/conversations/11111111-1111-4111-8111-111111111111/messages?page=1&pageSize=10', 'GET'),
      { params: Promise.resolve({ conversationId: '11111111-1111-4111-8111-111111111111' }) },
    );

    assert.equal(historyResponse.status, 200);
    const historyBody = await historyResponse.json();
    assert.equal(historyBody.items.length, 1);
  });
});