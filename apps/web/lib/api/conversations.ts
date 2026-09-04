import { z } from 'zod';
import {
  conversationCreateBodySchema,
  conversationDeleteResponseSchema,
  conversationListQuerySchema,
  conversationMessageCreateBodySchema,
  conversationMessageResponseSchema,
  conversationMessagesQuerySchema,
  conversationPageResponseSchema,
  conversationRenameBodySchema,
  conversationResponseSchema,
  messagePageResponseSchema,
  type ConversationListQuery,
  type ConversationMessagesQuery,
} from './contracts';
import { apiGet, apiSend } from './client';

export type ConversationSummary = z.infer<typeof conversationPageResponseSchema>['items'][number];
export type Conversation = z.infer<typeof conversationResponseSchema>['conversation'];
export type Message = z.infer<typeof messagePageResponseSchema>['items'][number];

export async function listConversations(query: Partial<ConversationListQuery> = {}) {
  const parsedQuery = conversationListQuerySchema.parse(query);
  const response = await apiGet('/api/conversations', parsedQuery);
  return conversationPageResponseSchema.parse(response);
}

export async function getConversation(conversationId: string) {
  const response = await apiGet(`/api/conversations/${conversationId}`);
  return conversationResponseSchema.parse(response);
}

export async function createConversation(input: { userId?: string; title?: string } = {}) {
  const response = await apiSend('/api/conversations', conversationCreateBodySchema.parse(input), { method: 'POST' });
  return conversationResponseSchema.parse(response);
}

export async function renameConversation(conversationId: string, input: { title: string }) {
  const response = await apiSend(`/api/conversations/${conversationId}`, conversationRenameBodySchema.parse(input), { method: 'PATCH' });
  return conversationResponseSchema.parse(response);
}

export async function deleteConversation(conversationId: string) {
  const response = await apiSend(`/api/conversations/${conversationId}`, undefined, { method: 'DELETE' });
  return conversationDeleteResponseSchema.parse(response);
}

export async function listConversationMessages(conversationId: string, query: ConversationMessagesQuery) {
  const parsedQuery = conversationMessagesQuerySchema.parse(query);
  const response = await apiGet(`/api/conversations/${conversationId}/messages`, parsedQuery);
  return messagePageResponseSchema.parse(response);
}

export async function sendConversationMessage(conversationId: string, content: string) {
  const response = await apiSend(`/api/conversations/${conversationId}/messages`, conversationMessageCreateBodySchema.parse({ content }), { method: 'POST' });
  return conversationMessageResponseSchema.parse(response);
}
