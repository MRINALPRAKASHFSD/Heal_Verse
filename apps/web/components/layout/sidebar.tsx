'use client';

import { ChevronLeft, Clock3, EllipsisVertical, LayoutGrid, MessageSquarePlus, Search, Settings, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, Button, Card, Dropdown, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

type SidebarConversation = {
  id: string;
  title: string;
  summary: string;
  time: string;
  group: 'Today' | 'Yesterday' | 'Older';
};

const groupOrder: SidebarConversation['group'][] = ['Today', 'Yesterday', 'Older'];

export function Sidebar({
  chats,
  collapsed,
  mobile,
  onToggleCollapse,
  onClose,
  selectedConversationId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  searchValue,
  onSearchChange,
  hasMore,
  onLoadMore,
  isLoadingMore,
  currentUser,
  onSignOut,
  onOpenAuth,
}: {
  chats: SidebarConversation[];
  collapsed: boolean;
  mobile?: boolean;
  onToggleCollapse: () => void;
  onClose?: () => void;
  selectedConversationId?: string | null;
  onSelectConversation: (conversationId: string) => void;
  onNewChat: () => void;
  onRenameConversation: (conversation: SidebarConversation) => void;
  onDeleteConversation: (conversation: SidebarConversation) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  currentUser?: { name?: string | null; email: string; image?: string | null } | null;
  onSignOut?: () => void;
  onOpenAuth?: () => void;
}) {
  const initials = currentUser
    ? (currentUser.name?.trim()
        ? currentUser.name
            .trim()
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
        : currentUser.email.slice(0, 2).toUpperCase())
    : 'HV';
  const content = (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 text-xs">HV</Avatar>
          <div>
            <p className="text-sm font-semibold">HealVerse</p>
            <p className="text-xs text-muted-foreground">Care navigation workspace</p>
          </div>
        </div>
        <Button aria-label="Collapse sidebar" className={cn('hidden md:inline-flex', collapsed ? 'rotate-180' : '')} variant="ghost" onClick={onToggleCollapse}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        {mobile ? (
          <Button aria-label="Close navigation" variant="ghost" onClick={onClose}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        ) : null}
      </div>

      <Button className="w-full gap-2" size="lg" onClick={onNewChat}>
        <MessageSquarePlus className="h-4 w-4" />
        New chat
      </Button>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-10" placeholder="Search chats" aria-label="Search chats" value={searchValue} onChange={(event) => onSearchChange(event.target.value)} />
      </div>

      <div className="space-y-2 overflow-y-auto pr-1">
        {!currentUser ? (
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <p className="text-xs leading-5 text-muted-foreground">
              Sign in to save and access your care conversations.
            </p>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <p className="text-xs text-muted-foreground">No conversations yet</p>
          </div>
        ) : (
          groupOrder.map((group) => {
            const groupChats = chats.filter((chat) => chat.group === group);
            if (groupChats.length === 0) {
              return null;
            }
            return (
              <section key={group} className="space-y-2">
                <p className="px-1 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">{group}</p>
                {groupChats.map((chat) => (
                  <Card
                    key={chat.id}
                    className={cn(
                      'p-3 transition',
                      selectedConversationId === chat.id
                        ? 'border-primary/40 bg-accent/60'
                        : 'cursor-pointer hover:border-primary/30 hover:bg-accent/60',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <button className="flex min-w-0 flex-1 items-start gap-3 text-left" type="button" onClick={() => onSelectConversation(chat.id)}>
                        <Clock3 className="mt-1 h-4 w-4 text-medical" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{chat.title}</p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{chat.summary}</p>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{chat.time}</span>
                      </button>
                      <Dropdown
                        label={
                          <Button aria-label={`Conversation actions for ${chat.title}`} className="h-8 w-8 rounded-full p-0" size="sm" variant="ghost">
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        }
                      >
                        <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-accent" onClick={() => onRenameConversation(chat)} type="button">
                          Rename
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-danger hover:bg-accent" onClick={() => onDeleteConversation(chat)} type="button">
                          Delete
                        </button>
                      </Dropdown>
                    </div>
                  </Card>
                ))}
              </section>
            );
          })
        )}
        {hasMore && currentUser ? (
          <Button className="w-full" disabled={isLoadingMore} variant="secondary" onClick={onLoadMore}>
            {isLoadingMore ? 'Loading more…' : 'Load more chats'}
          </Button>
        ) : null}
      </div>

      <div className="mt-auto space-y-3 border-t border-border pt-4">
        {currentUser ? (
          <Dropdown
            label={
              <Card className="flex items-center gap-3 p-3 hover:border-primary/30">
                <Avatar className="h-9 w-9 text-xs">{initials}</Avatar>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium">{currentUser.name || currentUser.email}</p>
                  <p className="truncate text-xs text-muted-foreground">{currentUser.name ? currentUser.email : 'Care workspace'}</p>
                </div>
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              </Card>
            }
          >
            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-danger hover:bg-accent" onClick={onSignOut} type="button">
              Sign out
            </button>
          </Dropdown>
        ) : (
          <Button className="w-full justify-center gap-2" variant="primary" onClick={onOpenAuth}>
            <UserCircle2 className="h-4 w-4" />
            Sign in / Register
          </Button>
        )}
        <Button className="w-full justify-start gap-2" variant="ghost">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );

  if (mobile) {
    return <motion.div className="h-full bg-card">{content}</motion.div>;
  }

  return <aside className={cn('hidden h-screen border-r border-border bg-card md:block', collapsed ? 'w-20' : 'w-[22rem]')}>{content}</aside>;
}