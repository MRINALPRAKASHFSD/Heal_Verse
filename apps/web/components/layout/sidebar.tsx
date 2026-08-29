'use client';

import { ChevronLeft, Clock3, LayoutGrid, MessageSquarePlus, Search, Settings, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, Button, Card, Dropdown, Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { ChatSession } from '@/features/chat/mock-data';

const groupOrder: ChatSession['group'][] = ['Today', 'Yesterday', 'Older'];

export function Sidebar({
  chats,
  collapsed,
  mobile,
  onToggleCollapse,
  onClose,
}: {
  chats: ChatSession[];
  collapsed: boolean;
  mobile?: boolean;
  onToggleCollapse: () => void;
  onClose?: () => void;
}) {
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

      <Button className="w-full gap-2" size="lg">
        <MessageSquarePlus className="h-4 w-4" />
        New chat
      </Button>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-10" placeholder="Search chats" aria-label="Search chats" />
      </div>

      <div className="space-y-2 overflow-y-auto pr-1">
        {groupOrder.map((group) => (
          <section key={group} className="space-y-2">
            <p className="px-1 text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">{group}</p>
            {chats
              .filter((chat) => chat.group === group)
              .map((chat) => (
                <Card key={chat.title} className="cursor-pointer p-3 transition hover:border-primary/30 hover:bg-accent/60">
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-1 h-4 w-4 text-medical" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{chat.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{chat.summary}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{chat.time}</span>
                  </div>
                </Card>
              ))}
          </section>
        ))}
      </div>

      <div className="mt-auto space-y-3 border-t border-border pt-4">
        <Dropdown
          label={
            <Card className="flex items-center gap-3 p-3 hover:border-primary/30">
              <Avatar className="h-9 w-9 text-xs">AM</Avatar>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium">A. Morgan</p>
                <p className="truncate text-xs text-muted-foreground">Premium care workspace</p>
              </div>
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            </Card>
          }
        >
          <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-accent">Profile</button>
          <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-accent">Preferences</button>
          <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-accent">Logout</button>
        </Dropdown>
        <Button className="w-full justify-start gap-2" variant="secondary">
          <UserCircle2 className="h-4 w-4" />
          User profile
        </Button>
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