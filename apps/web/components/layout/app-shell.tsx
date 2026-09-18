'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Drawer, EmptyState, ErrorState, LoadingSkeleton, Modal, Button, Input } from '@/components/ui';
import { Sidebar } from './sidebar';
import { ContextPanel } from './context-panel';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatBubble } from '@/components/chat/chat-bubble';
import { ChatInput } from '@/components/chat/chat-input';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import {
  useCreateConversationMutation,
  useConversationListQuery,
  useConversationMessagesQuery,
  useDeleteConversationMutation,
  useRenameConversationMutation,
  useSendConversationMessageMutation,
} from '@/hooks/chat';
import { useCurrentUser, useSignInMutation, useSignUpMutation, useSignOutMutation } from '@/hooks/auth';
import type { ConversationSummary } from '@/lib/api/conversations';

const suggestedQuestions = [
  'How can I prepare for a routine checkup?',
  'What questions should I ask after a new prescription?',
  'How do I organize medication reminders safely?',
];

function getRelativeGroup(updatedAt: string): 'Today' | 'Yesterday' | 'Older' {
  const diffMs = Date.now() - new Date(updatedAt).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'Today';
  }

  if (diffDays === 1) {
    return 'Yesterday';
  }

  return 'Older';
}

function formatRelativeTime(updatedAt: string) {
  const diffMs = Date.now() - new Date(updatedAt).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
}

function mapConversation(conversation: ConversationSummary) {
  return {
    id: conversation.id,
    title: conversation.title,
    summary: conversation.lastMessagePreview,
    time: formatRelativeTime(conversation.updatedAt),
    group: getRelativeGroup(conversation.updatedAt),
  };
}

function flattenConversationPages(pages: ReturnType<typeof useConversationListQuery>['data']) {
  return pages?.pages.flatMap((page) => page.items) ?? [];
}

function flattenMessagePages(pages: ReturnType<typeof useConversationMessagesQuery>['data']) {
  return pages?.pages.flatMap((page) => page.items) ?? [];
}

export function AppShell({ initialConversationId }: { initialConversationId?: string }) {
  const { data: authData, isLoading: authLoading } = useCurrentUser();
  const currentUser = authData?.user ?? null;

  const signInMutation = useSignInMutation();
  const signUpMutation = useSignUpMutation();
  const signOutMutation = useSignOutMutation();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [conversationSearch, setConversationSearch] = useState('');
  const [messageSearch, setMessageSearch] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(initialConversationId ?? null);
  const [renameTarget, setRenameTarget] = useState<ReturnType<typeof mapConversation> | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const deferredConversationSearch = useDeferredValue(conversationSearch.trim() || undefined);
  const listQuery = useConversationListQuery(
    { q: deferredConversationSearch, pageSize: 10 },
    { enabled: Boolean(currentUser) },
  );

  const conversations = useMemo(() => flattenConversationPages(listQuery.data).map(mapConversation), [listQuery.data]);
  const activeConversation = conversations.find((conversation) => conversation.id === selectedConversationId) ?? conversations[0] ?? null;

  useEffect(() => {
    if (activeConversation && activeConversation.id !== selectedConversationId) {
      setSelectedConversationId(activeConversation.id);
    }
  }, [activeConversation, selectedConversationId]);

  const messagesQuery = useConversationMessagesQuery(selectedConversationId, { pageSize: 20 });
  const messages = useMemo(() => flattenMessagePages(messagesQuery.data), [messagesQuery.data]);
  const filteredMessages = useMemo(() => {
    const search = messageSearch.trim().toLowerCase();

    if (!search) {
      return messages;
    }

    return messages.filter((message) => message.content.toLowerCase().includes(search));
  }, [messages, messageSearch]);

  const createConversationMutation = useCreateConversationMutation();
  const renameConversationMutation = useRenameConversationMutation();
  const deleteConversationMutation = useDeleteConversationMutation();
  const sendMessageMutation = useSendConversationMessageMutation(selectedConversationId);

  const activeConversationTitle = activeConversation?.title ?? 'HealVerse';
  const hasMoreConversations = Boolean(listQuery.hasNextPage);

  function handleSelectConversation(conversationId: string) {
    setSelectedConversationId(conversationId);
    setMessageSearch('');
  }

  async function handleCreateConversation() {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    const response = await createConversationMutation.mutateAsync();
    setSelectedConversationId(response.conversation.id);
    setMessageSearch('');
  }

  async function handleSendMessage(content: string) {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    await sendMessageMutation.mutateAsync(content);
    setMessageSearch('');
  }

  function handleRenameConversation(conversation: ReturnType<typeof mapConversation>) {
    setRenameTarget(conversation);
    setRenameValue(conversation.title);
  }

  async function handleDeleteConversation(conversation: ReturnType<typeof mapConversation>) {
    const shouldDelete = window.confirm(`Delete "${conversation.title}"?`);

    if (!shouldDelete) {
      return;
    }

    await deleteConversationMutation.mutateAsync(conversation.id);

    if (selectedConversationId === conversation.id) {
      setSelectedConversationId(conversations.find((item) => item.id !== conversation.id)?.id ?? null);
    }
  }

  async function submitRename() {
    if (!renameTarget) {
      return;
    }

    await renameConversationMutation.mutateAsync({ conversationId: renameTarget.id, title: renameValue });
    setRenameTarget(null);
    setRenameValue('');
  }

  async function handleAuthSubmit(event: React.FormEvent) {
    event.preventDefault();
    setAuthError(null);

    try {
      if (authMode === 'sign-in') {
        await signInMutation.mutateAsync({ email: authEmail, password: authPassword });
      } else {
        await signUpMutation.mutateAsync({ email: authEmail, password: authPassword, name: authName });
      }
      setAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <div className="flex flex-col items-center gap-4 text-center">
          <LoadingSkeleton className="h-12 w-12 rounded-full" />
          <LoadingSkeleton className="h-6 w-48 rounded-lg" />
          <p className="text-xs text-muted-foreground">Authenticating care workspace…</p>
        </div>
      </div>
    );
  }

  if (listQuery.isError && currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <ErrorState
          description={listQuery.error instanceof Error ? listQuery.error.message : 'Unable to load conversations'}
          onRetry={() => listQuery.refetch()}
          title="Conversation list failed"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        chats={conversations}
        collapsed={sidebarCollapsed}
        currentUser={currentUser}
        hasMore={hasMoreConversations}
        isLoadingMore={listQuery.isFetchingNextPage}
        onDeleteConversation={handleDeleteConversation}
        onLoadMore={() => listQuery.fetchNextPage()}
        onNewChat={handleCreateConversation}
        onOpenAuth={() => setAuthModalOpen(true)}
        onRenameConversation={handleRenameConversation}
        onSearchChange={setConversationSearch}
        onSelectConversation={handleSelectConversation}
        onSignOut={() => signOutMutation.mutate()}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
        searchValue={conversationSearch}
        selectedConversationId={selectedConversationId}
      />

      <Drawer open={sidebarOpen} title="HealVerse navigation" onClose={() => setSidebarOpen(false)}>
        <Sidebar
          chats={conversations}
          collapsed={false}
          currentUser={currentUser}
          hasMore={hasMoreConversations}
          isLoadingMore={listQuery.isFetchingNextPage}
          mobile
          onClose={() => setSidebarOpen(false)}
          onDeleteConversation={handleDeleteConversation}
          onLoadMore={() => listQuery.fetchNextPage()}
          onNewChat={handleCreateConversation}
          onOpenAuth={() => {
            setSidebarOpen(false);
            setAuthModalOpen(true);
          }}
          onRenameConversation={handleRenameConversation}
          onSearchChange={setConversationSearch}
          onSelectConversation={handleSelectConversation}
          onSignOut={() => signOutMutation.mutate()}
          onToggleCollapse={() => undefined}
          searchValue={conversationSearch}
          selectedConversationId={selectedConversationId}
        />
      </Drawer>

      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        <ChatHeader
          contextOpen={contextOpen}
          hasActiveConversation={Boolean(currentUser && activeConversation && selectedConversationId)}
          messageSearchValue={messageSearch}
          onMessageSearchChange={setMessageSearch}
          onOpenSidebar={() => setSidebarOpen(true)}
          onToggleContext={() => setContextOpen((current) => !current)}
          title={currentUser ? activeConversationTitle : 'HealVerse'}
        />

        <section className="flex min-h-0 flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid min-h-[calc(100vh-10rem)] gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]"
            initial={{ opacity: 0, y: 10 }}
          >
            <div className="flex min-w-0 flex-col gap-6">
              <Card className="overflow-hidden border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  {currentUser ? 'Care workspace' : 'Welcome screen'}
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  {currentUser
                    ? activeConversation
                      ? 'Calm, structured support for care planning.'
                      : 'No conversation selected'
                    : 'HealVerse Care Workspace'}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {currentUser
                    ? 'Session-derived authenticated workspace. Optimistic message delivery and care plan navigation.'
                    : 'A private, session-authenticated healthcare workspace. Sign in or create an account to start managing your health conversations, medication routines, and care planning.'}
                </p>
              </Card>

              <div className="flex-1 space-y-4 rounded-3xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl md:p-6">
                {!currentUser ? (
                  <EmptyState
                    description="Authentication is required to access or create private medical conversations."
                    title="Sign in required"
                  >
                    <Button onClick={() => { setAuthMode('sign-in'); setAuthModalOpen(true); }}>
                      Sign in to begin
                    </Button>
                  </EmptyState>
                ) : messagesQuery.isLoading ? (
                  <div className="space-y-4">
                    <LoadingSkeleton className="h-20 w-full rounded-3xl" />
                    <LoadingSkeleton className="ml-auto h-20 w-4/5 rounded-3xl" />
                    <LoadingSkeleton className="h-20 w-full rounded-3xl" />
                  </div>
                ) : messagesQuery.isError ? (
                  <ErrorState
                    description={messagesQuery.error instanceof Error ? messagesQuery.error.message : 'Unable to load message history'}
                    onRetry={() => messagesQuery.refetch()}
                    title="Message history failed"
                  />
                ) : filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => <ChatBubble key={message.id} message={message} />)
                ) : (
                  <EmptyState
                    description={activeConversation ? 'Send a message to start the conversation.' : 'Create a conversation to begin.'}
                    title={activeConversation ? 'No messages yet' : 'No conversation selected'}
                  />
                )}

                {currentUser && messagesQuery.hasNextPage ? (
                  <Button className="mx-auto" disabled={messagesQuery.isFetchingNextPage} onClick={() => messagesQuery.fetchNextPage()} variant="secondary">
                    {messagesQuery.isFetchingNextPage ? 'Loading more…' : 'Load older messages'}
                  </Button>
                ) : null}

                {currentUser && sendMessageMutation.isPending ? (
                  <div className="pt-2">
                    <TypingIndicator />
                  </div>
                ) : null}
              </div>

              <Card className="p-4 md:p-6">
                <p className="text-sm font-medium text-muted-foreground">Suggested questions</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {suggestedQuestions.map((question) => (
                    <button
                      className="rounded-2xl border border-border bg-background px-4 py-3 text-left text-sm transition hover:border-primary/30 hover:bg-accent/50"
                      key={question}
                      onClick={() => {
                        if (!currentUser) {
                          setAuthMode('sign-in');
                          setAuthModalOpen(true);
                        } else {
                          handleSendMessage(question);
                        }
                      }}
                      type="button"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </Card>

              <ChatInput
                isDisabled={Boolean(currentUser && (!selectedConversationId || sendMessageMutation.isPending))}
                isSubmitting={sendMessageMutation.isPending}
                onRequireAuth={!currentUser ? () => { setAuthMode('sign-in'); setAuthModalOpen(true); } : undefined}
                onSend={handleSendMessage}
              />
            </div>

            <ContextPanel collapsed={!contextOpen} isAuthenticated={Boolean(currentUser)} />
          </motion.div>
        </section>
      </main>

      <Modal description="Rename the selected conversation." onClose={() => setRenameTarget(null)} open={Boolean(renameTarget)} title="Rename conversation">
        <div className="space-y-4">
          <Input autoFocus onChange={(event) => setRenameValue(event.target.value)} value={renameValue} />
          <div className="flex justify-end gap-3">
            <Button onClick={() => setRenameTarget(null)} variant="secondary">
              Cancel
            </Button>
            <Button disabled={renameConversationMutation.isPending || renameValue.trim().length === 0} onClick={submitRename}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        description={authMode === 'sign-in' ? 'Sign in to access your HealVerse care workspace.' : 'Create an account to begin private care navigation.'}
        onClose={() => {
          setAuthModalOpen(false);
          setAuthError(null);
        }}
        open={authModalOpen}
        title={authMode === 'sign-in' ? 'Sign in to HealVerse' : 'Create an account'}
      >
        <form className="space-y-4" onSubmit={handleAuthSubmit}>
          {authError ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-500">
              {authError}
            </div>
          ) : null}

          {authMode === 'sign-up' ? (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground" htmlFor="auth-name">
                Full name
              </label>
              <Input
                id="auth-name"
                onChange={(event) => setAuthName(event.target.value)}
                placeholder="Dr. Alex Morgan"
                value={authName}
              />
            </div>
          ) : null}

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="auth-email">
              Email address
            </label>
            <Input
              id="auth-email"
              onChange={(event) => setAuthEmail(event.target.value)}
              placeholder="alex.morgan@example.com"
              required
              type="email"
              value={authEmail}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="auth-password">
              Password
            </label>
            <Input
              id="auth-password"
              onChange={(event) => setAuthPassword(event.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={authPassword}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              className="w-full"
              disabled={signInMutation.isPending || signUpMutation.isPending || !authEmail || !authPassword}
              type="submit"
            >
              {signInMutation.isPending || signUpMutation.isPending
                ? 'Processing…'
                : authMode === 'sign-in'
                  ? 'Sign in'
                  : 'Create account'}
            </Button>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>{authMode === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}</span>
              <button
                className="font-medium text-primary hover:underline"
                onClick={() => {
                  setAuthMode(authMode === 'sign-in' ? 'sign-up' : 'sign-in');
                  setAuthError(null);
                }}
                type="button"
              >
                {authMode === 'sign-in' ? 'Create an account' : 'Sign in instead'}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}