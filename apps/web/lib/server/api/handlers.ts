import { randomUUID } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import type { Conversation, Message, UUID } from '@healverse/application';
import { archiveConversationRequestSchema, createConversationRequestSchema, renameConversationRequestSchema, retrieveConversationRequestSchema, type CreateConversationRequestDto, type RenameConversationRequestDto, type ArchiveConversationRequestDto, type RetrieveConversationRequestDto } from '@healverse/application';
import { conversationSchema, conversationSummarySchema, messageSchema as sharedMessageSchema, MessageRole, MessageStatus, type ISODateString } from '@healverse/shared';
import type { BetterAuthUser } from '@healverse/infrastructure';
import { BadRequestError, ForbiddenError, InternalError, NotFoundError, UnauthorizedError, normalizeError, RateLimitError } from './errors';
import { conversationCreateBodySchema, conversationItemParamsSchema, conversationListQuerySchema, conversationMessageCreateBodySchema, conversationMessageResponseSchema, conversationMessagesQuerySchema, conversationPageResponseSchema, conversationResponseSchema, conversationUpdateBodySchema, messagePageResponseSchema } from './schemas';
import { getDefaultApiRuntime, type ApiRuntime } from './runtime';

export interface RouteContext {
  readonly params?: Promise<Record<string, string>> | Record<string, string>;
}

interface RateLimitState {
  readonly enabled: boolean;
  readonly limit: number;
  readonly windowMs: number;
  readonly buckets: Map<string, { count: number; resetAt: number }>;
}

const rateLimitState: RateLimitState = {
  enabled: process.env.API_RATE_LIMIT_ENABLED !== 'false',
  limit: Number(process.env.API_RATE_LIMIT_MAX_REQUESTS ?? 120),
  windowMs: Number(process.env.API_RATE_LIMIT_WINDOW_MS ?? 60_000),
  buckets: new Map(),
};

function getRequestId(request: NextRequest): string {
  return request.headers.get('x-request-id') ?? randomUUID();
}

function getClientKey(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'anonymous';
}

function jsonResponse(body: unknown, status = 200, requestId?: string): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: requestId ? { 'x-request-id': requestId } : undefined,
  });
}

function parseParams(context?: RouteContext): Promise<Record<string, string>> {
  if (!context?.params) {
    return Promise.resolve({});
  }

  return Promise.resolve(context.params);
}

function applyRateLimit(request: NextRequest, requestId: string): void {
  if (!rateLimitState.enabled) {
    return;
  }

  const bucketKey = `${getClientKey(request)}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const bucket = rateLimitState.buckets.get(bucketKey);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitState.buckets.set(bucketKey, { count: 1, resetAt: now + rateLimitState.windowMs });
    return;
  }

  if (bucket.count >= rateLimitState.limit) {
    throw new RateLimitError('Too many requests', { requestId, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) });
  }

  bucket.count += 1;
}

function ensureMethod(request: NextRequest, methods: string[]): void {
  if (!methods.includes(request.method)) {
    throw new BadRequestError(`Method ${request.method} is not allowed`);
  }
}

async function parseJsonBody<T>(request: NextRequest, schema: z.ZodType<T>): Promise<T> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    throw new BadRequestError('Request body must be valid JSON');
  }

  return schema.parse(payload);
}

function toConversationSummary(conversation: Conversation, messages: Message[]): z.infer<typeof conversationSummarySchema> {
  const lastMessage = messages.at(-1);

  return conversationSummarySchema.parse({
    id: conversation.id,
    conversationId: conversation.id,
    title: conversation.title,
    type: conversation.type,
    lastMessagePreview: (lastMessage?.content ?? conversation.title).slice(0, 120),
    messageCount: Math.max(messages.length, conversation.messageIds.length, 1),
    updatedAt: lastMessage?.updatedAt ?? conversation.updatedAt,
  });
}

async function executeRoute<T>(request: NextRequest, routeName: string, handler: () => Promise<T>): Promise<NextResponse> {
  const requestId = getRequestId(request);
  const runtime = getDefaultApiRuntime();
  const startedAt = Date.now();

  try {
    applyRateLimit(request, requestId);
    runtime.logger.info(`API request started`, { routeName, requestId, method: request.method, path: request.nextUrl.pathname });
    const result = await handler();
    runtime.logger.info(`API request completed`, { routeName, requestId, durationMs: Date.now() - startedAt });
    return jsonResponse(result, 200, requestId);
  } catch (error) {
    const normalizedError = normalizeError(error);
    runtime.logger.error(`API request failed`, {
      routeName,
      requestId,
      status: normalizedError.status,
      code: normalizedError.code,
      message: normalizedError.message,
      details: normalizedError.details,
    });

    return jsonResponse(
      {
        error: {
          code: normalizedError.code,
          message: normalizedError.message,
          details: normalizedError.details,
        },
        requestId,
      },
      normalizedError.status,
      requestId,
    );
  }
}

async function getAuthenticatedUser(request: NextRequest, runtime: ApiRuntime): Promise<BetterAuthUser> {
  const sessionPayload = await runtime.container?.authAdapter?.getSession?.(request.headers);
  if (!sessionPayload || !sessionPayload.user) {
    throw new UnauthorizedError('Authentication required to access conversations');
  }

  return sessionPayload.user;
}

export function createConversationsCollectionHandlers(runtime: ApiRuntime = getDefaultApiRuntime()) {
  return {
    GET: async (request: NextRequest) =>
      executeRoute(request, 'conversations.list', async () => {
        const user = await getAuthenticatedUser(request, runtime);
        const query = conversationListQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()));
        const result = await runtime.services.searchConversations({
          ...query,
          userId: user.id as UUID,
        });
        return conversationPageResponseSchema.parse(result);
      }),
    POST: async (request: NextRequest) =>
      executeRoute(request, 'conversations.create', async () => {
        const user = await getAuthenticatedUser(request, runtime);
        const body = conversationCreateBodySchema.parse(await request.json());
        const conversation = await runtime.services.conversationService.createConversation({
          title: body.title,
          userId: user.id as UUID,
        });
        return conversationResponseSchema.parse({ conversation });
      }),
  };
}

export function createConversationItemHandlers(runtime: ApiRuntime = getDefaultApiRuntime()) {
  return {
    GET: async (request: NextRequest, context?: RouteContext) =>
      executeRoute(request, 'conversations.retrieve', async () => {
        const user = await getAuthenticatedUser(request, runtime);
        const params = conversationItemParamsSchema.parse(await parseParams(context));
        const conversation = await runtime.services.conversationService.retrieveConversation(params.conversationId as UUID);
        if (!conversation) {
          throw new NotFoundError('Conversation not found', { conversationId: params.conversationId });
        }

        if (!conversation.participantIds.includes(user.id as UUID)) {
          throw new ForbiddenError('You do not have access to this conversation');
        }

        return conversationResponseSchema.parse({ conversation });
      }),
    PATCH: async (request: NextRequest, context?: RouteContext) =>
      executeRoute(request, 'conversations.update', async () => {
        const user = await getAuthenticatedUser(request, runtime);
        const params = conversationItemParamsSchema.parse(await parseParams(context));
        const body = conversationUpdateBodySchema.parse(await request.json());
        const conversation = await runtime.services.conversationService.retrieveConversation(params.conversationId as UUID);

        if (!conversation) {
          throw new NotFoundError('Conversation not found', { conversationId: params.conversationId });
        }

        if (!conversation.participantIds.includes(user.id as UUID)) {
          throw new ForbiddenError('You do not have permission to update this conversation');
        }

        let updatedConversation = conversation;

        if (body.title !== undefined) {
          updatedConversation = await runtime.services.conversationService.renameConversation({ conversationId: params.conversationId as UUID, title: body.title });
        }

        if (body.archived !== undefined) {
          updatedConversation = body.archived
            ? await runtime.services.conversationService.archiveConversation(params.conversationId as UUID)
            : await runtime.services.conversationService.saveConversation({
                ...updatedConversation,
                archivedAt: undefined,
              });
        }

        return conversationResponseSchema.parse({ conversation: updatedConversation });
      }),
    DELETE: async (request: NextRequest, context?: RouteContext) =>
      executeRoute(request, 'conversations.delete', async () => {
        const user = await getAuthenticatedUser(request, runtime);
        const params = conversationItemParamsSchema.parse(await parseParams(context));
        const conversation = await runtime.services.conversationService.retrieveConversation(params.conversationId as UUID);

        if (!conversation) {
          throw new NotFoundError('Conversation not found', { conversationId: params.conversationId });
        }

        if (!conversation.participantIds.includes(user.id as UUID)) {
          throw new ForbiddenError('You do not have permission to delete this conversation');
        }

        await runtime.services.conversationService.deleteConversation(params.conversationId as UUID);
        return { ok: true };
      }),
  };
}

export function createConversationMessagesHandlers(runtime: ApiRuntime = getDefaultApiRuntime()) {
  return {
    GET: async (request: NextRequest, context?: RouteContext) =>
      executeRoute(request, 'conversations.messages.list', async () => {
        const user = await getAuthenticatedUser(request, runtime);
        const params = conversationItemParamsSchema.parse(await parseParams(context));
        const conversation = await runtime.services.conversationService.retrieveConversation(params.conversationId as UUID);

        if (!conversation) {
          throw new NotFoundError('Conversation not found', { conversationId: params.conversationId });
        }

        if (!conversation.participantIds.includes(user.id as UUID)) {
          throw new ForbiddenError('You do not have permission to view messages in this conversation');
        }

        const query = conversationMessagesQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()));
        const result = await runtime.services.listConversationMessages({ conversationId: params.conversationId as UUID, page: query.page, pageSize: query.pageSize });
        return messagePageResponseSchema.parse(result);
      }),
    POST: async (request: NextRequest, context?: RouteContext) =>
      executeRoute(request, 'conversations.messages.create', async () => {
        const user = await getAuthenticatedUser(request, runtime);
        const params = conversationItemParamsSchema.parse(await parseParams(context));
        const body = conversationMessageCreateBodySchema.parse(await request.json());
        const conversation = await runtime.services.conversationService.retrieveConversation(params.conversationId as UUID);

        if (!conversation) {
          throw new NotFoundError('Conversation not found', { conversationId: params.conversationId });
        }

        if (!conversation.participantIds.includes(user.id as UUID)) {
          throw new ForbiddenError('You do not have permission to send messages in this conversation');
        }

        const userMessage = await runtime.services.aiService.sendMessage({
          conversationId: params.conversationId as UUID,
          message: {
            id: randomUUID() as UUID,
            conversationId: params.conversationId as UUID,
            role: MessageRole.User,
            status: MessageStatus.Sent,
            content: body.content,
            attachments: [],
            createdAt: new Date().toISOString() as ISODateString,
            updatedAt: new Date().toISOString() as ISODateString,
          },
        });

        const assistantMessage = await runtime.services.aiService.receiveMessage({
          conversationId: params.conversationId as UUID,
          message: userMessage.message,
        });

        return conversationMessageResponseSchema.parse({
          message: userMessage.message,
          assistantMessage: assistantMessage.message,
        });
      }),
  };
}