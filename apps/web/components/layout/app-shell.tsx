'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { recentChats, suggestedQuestions } from '@/features/chat/mock-data';
import { Card, Drawer, EmptyState } from '@/components/ui';
import { Sidebar } from './sidebar';
import { ContextPanel } from './context-panel';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatBubble } from '@/components/chat/chat-bubble';
import { ChatInput } from '@/components/chat/chat-input';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import type { mockChatSession } from '@/features/chat/mock-data';

type ChatSession = typeof mockChatSession;

export function AppShell({ session }: { session: { title: string; subtitle: string; messages: ChatSession['messages'] } }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        chats={recentChats}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
      />

      <Drawer open={sidebarOpen} title="HealVerse navigation" onClose={() => setSidebarOpen(false)}>
        <Sidebar chats={recentChats} mobile onClose={() => setSidebarOpen(false)} collapsed={false} onToggleCollapse={() => undefined} />
      </Drawer>

      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        <ChatHeader
          contextOpen={contextOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
          onToggleContext={() => setContextOpen((current) => !current)}
          title={session.title}
        />

        <section className="flex min-h-0 flex-1 flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            className="grid min-h-[calc(100vh-10rem)] gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]"
          >
            <div className="flex min-w-0 flex-col gap-6">
              <Card className="overflow-hidden border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Welcome screen</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">{session.subtitle}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  This shell is ready for future AI integration, but today it is a polished interaction layer with no backend logic.
                </p>
              </Card>

              <div className="flex-1 space-y-4 rounded-3xl border border-border bg-card/70 p-4 shadow-sm backdrop-blur-xl md:p-6">
                {session.messages.length > 0 ? (
                  session.messages.map((message) => <ChatBubble key={message.id} message={message} />)
                ) : (
                  <EmptyState
                    description="Start a conversation to explore the shell, message surfaces, and empty-state behavior."
                    title="No conversation yet"
                  />
                )}

                <div className="pt-2">
                  <TypingIndicator />
                </div>
              </div>

              <Card className="p-4 md:p-6">
                <p className="text-sm font-medium text-muted-foreground">Suggested questions</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      className="rounded-2xl border border-border bg-background px-4 py-3 text-left text-sm transition hover:border-primary/30 hover:bg-accent/50"
                      type="button"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </Card>

              <ChatInput />
            </div>

            <ContextPanel collapsed={!contextOpen} />
          </motion.div>
        </section>
      </main>
    </div>
  );
}