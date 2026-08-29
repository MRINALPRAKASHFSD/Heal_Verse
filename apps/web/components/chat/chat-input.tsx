'use client';

import { Paperclip, Send, Volume2 } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';

export function ChatInput() {
  return (
    <Card className="border-t border-border bg-background/90 p-3 shadow-none backdrop-blur-xl md:p-4">
      <div className="flex items-end gap-3">
        <Button aria-label="Attach file" disabled size="sm" variant="secondary">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button aria-label="Voice input" disabled size="sm" variant="secondary">
          <Volume2 className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <Input aria-label="Message input" placeholder="Ask about care plans, medication routines, or next steps" />
        </div>
        <Button aria-label="Send message" size="sm">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}