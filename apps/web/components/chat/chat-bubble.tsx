import { motion } from 'framer-motion';
import type { ChatMessage } from '@/features/chat/mock-data';
import { Avatar, Card } from '@/components/ui';
import { cn } from '@/lib/utils';

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser ? <Avatar className="mt-1 h-9 w-9 shrink-0 text-xs">HV</Avatar> : null}
      <Card
        className={cn(
          'max-w-[min(100%,42rem)] px-4 py-3 text-sm leading-7',
          isUser
            ? 'border-primary/20 bg-primary text-primary-foreground'
            : 'bg-card text-card-foreground',
        )}
      >
        <p>{message.content}</p>
        <div className={cn('mt-2 text-[11px] uppercase tracking-[0.25em]', isUser ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
          {message.timestamp}
          {message.isStreaming ? ' · streaming' : ''}
        </div>
      </Card>
      {isUser ? <Avatar className="mt-1 h-9 w-9 shrink-0 bg-secondary text-xs text-secondary-foreground">U</Avatar> : null}
    </motion.div>
  );
}