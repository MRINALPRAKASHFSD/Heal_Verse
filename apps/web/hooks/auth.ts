'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/lib/auth/client';
import { chatQueryKeys } from '@/lib/api/query-keys';

export type CurrentUser = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
};

export type CurrentSession = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date | string;
};

export type AuthResponse = {
  user: CurrentUser;
  session: CurrentSession;
};

export const authQueryKeys = {
  all: ['auth'] as const,
  me: () => [...authQueryKeys.all, 'me'] as const,
};

export function useCurrentUser() {
  return useQuery<AuthResponse | null>({
    queryKey: authQueryKeys.me(),
    queryFn: async () => {
      const response = await fetch('/api/me');
      if (response.status === 401) {
        return null;
      }
      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useSignInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const result = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
      });
      if (result.error) {
        throw new Error(result.error.message || 'Failed to sign in');
      }
      return result.data;
    },
    onSuccess: async (data) => {
      if (data && typeof data === 'object' && 'user' in data && 'session' in data) {
        queryClient.setQueryData(authQueryKeys.me(), data as unknown as AuthResponse);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: authQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversations() }),
      ]);
    },
  });
}

export function useSignUpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string; name?: string }) => {
      const result = await authClient.signUp.email({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name || credentials.email.split('@')[0] || 'User',
      });
      if (result.error) {
        throw new Error(result.error.message || 'Failed to sign up');
      }
      return result.data;
    },
    onSuccess: async (data) => {
      if (data && typeof data === 'object' && 'user' in data && 'session' in data) {
        queryClient.setQueryData(authQueryKeys.me(), data as unknown as AuthResponse);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: authQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversations() }),
      ]);
    },
  });
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
    onSuccess: async () => {
      queryClient.setQueryData(authQueryKeys.me(), null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: authQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.conversations() }),
      ]);
    },
  });
}
