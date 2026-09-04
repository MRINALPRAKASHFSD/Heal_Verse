export const chatQueryKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatQueryKeys.all, 'conversations'] as const,
  conversationList: (query: { userId?: string; q?: string; archived?: boolean; pageSize: number }) =>
    [...chatQueryKeys.conversations(), 'list', query] as const,
  conversation: (conversationId: string) => [...chatQueryKeys.conversations(), conversationId] as const,
  messages: (conversationId: string, query: { pageSize: number }) =>
    [...chatQueryKeys.conversations(), conversationId, 'messages', query] as const,
};

