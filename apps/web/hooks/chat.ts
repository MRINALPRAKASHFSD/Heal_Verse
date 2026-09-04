'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createConversation,
  deleteConversation,
  listConversationMessages,
  listConversations,
  renameConversation,
  sendConversationMessage,
} from '@/lib/api/conversations';
import { chatQueryKeys } from '@/lib/api/query-keys';

type ConversationListQuery = {
  userId?: string;
  q?: string;
  archived?: boolean;
  pageSize: number;
};

type ConversationMessagesQuery = {
  pageSize: number;
};

function getNextPage(page: { page: number; pageSize: number; total: number }) {
  return page.page * page.pageSize < page.total ? page.page + 1 : undefined;
}

export function useConversationListQuery(query: ConversationListQuery, options?: { enabled?: boolean }) {
  return useInfiniteQuery({
    enabled: options?.enabled ?? true,
    queryKey: chatQueryKeys.conversationList(query),
    queryFn: ({ pageParam }) => listConversations({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });
}

export function useConversationMessagesQuery(conversationId: string | null, query: ConversationMessagesQuery) {
  return useInfiniteQuery({
    enabled: Boolean(conversationId),
    queryKey: conversationId ? chatQueryKeys.messages(conversationId, query) : chatQueryKeys.conversations(),
    queryFn: ({ pageParam }) => listConversationMessages(conversationId ?? '', { ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
  });
}

export function useCreateConversationMutation(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title?: string) => createConversation({ userId, title }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
      toast.success('Conversation created');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Unable to create conversation');
    },
  });
}

export function useRenameConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, title }: { conversationId: string; title: string }) => renameConversation(conversationId, { title }),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversation(variables.conversationId) }),
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversations() }),
      ]);
      toast.success('Conversation renamed');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Unable to rename conversation');
    },
  });
}

export function useDeleteConversationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
      toast.success('Conversation deleted');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Unable to delete conversation');
    },
  });
}

export function useSendConversationMessageMutation(conversationId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => {
      if (!conversationId) {
        throw new Error('Select a conversation first');
      }

      return sendConversationMessage(conversationId, content);
    },
    onMutate: async (content) => {
      if (!conversationId) {
        return null;
      }

      const queryKey = chatQueryKeys.messages(conversationId, { pageSize: 20 });
      await queryClient.cancelQueries({ queryKey });

      const snapshot = queryClient.getQueryData<{
        pages: Array<{ items: Array<{ id: string; role: string; content: string; timestamp: string; isStreaming?: boolean }> }>;
        pageParams: number[];
      }>(queryKey);

      const now = new Date().toISOString();
      const optimisticUserMessage = {
        id: `optimistic-user-${now}`,
        conversationId,
        role: 'user' as const,
        status: 'sending' as const,
        content,
        attachments: [],
        createdAt: now,
        updatedAt: now,
      };

      const optimisticAssistantMessage = {
        id: `optimistic-assistant-${now}`,
        conversationId,
        role: 'assistant' as const,
        status: 'streaming' as const,
        content: 'Assistant is preparing a response…',
        attachments: [],
        createdAt: now,
        updatedAt: now,
        isStreaming: true,
      };

      queryClient.setQueryData(queryKey, (current: typeof snapshot) => {
        if (!current) {
          return {
            pageParams: [1],
            pages: [{ items: [optimisticUserMessage, optimisticAssistantMessage] }],
          };
        }

        const firstPage = current.pages[0] ?? { items: [] };

        return {
          ...current,
          pages: [
            {
              ...firstPage,
              items: [...firstPage.items, optimisticUserMessage, optimisticAssistantMessage],
            },
            ...current.pages.slice(1),
          ],
        };
      });

      return { snapshot, queryKey };
    },
    onError: (error, _content, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(context.queryKey, context.snapshot);
      }

      toast.error(error instanceof Error ? error.message : 'Unable to send message');
    },
    onSuccess: async () => {
      if (conversationId) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversation(conversationId) }),
          queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversations() }),
          queryClient.invalidateQueries({ queryKey: chatQueryKeys.messages(conversationId, { pageSize: 20 }) }),
        ]);
      }

      toast.success('Message sent');
    },
  });
}
