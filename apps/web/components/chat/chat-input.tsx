'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Paperclip, Send, Volume2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Card, Input } from '@/components/ui';

const messageFormSchema = z.object({
  content: z.string().trim().min(1, 'Message cannot be empty'),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

export function ChatInput({
  onSend,
  isDisabled,
  isSubmitting,
  onRequireAuth,
}: {
  onSend: (content: string) => Promise<void> | void;
  isDisabled?: boolean;
  isSubmitting?: boolean;
  onRequireAuth?: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: { content: '' },
  });

  async function submit(values: MessageFormValues) {
    if (onRequireAuth) {
      onRequireAuth();
      return;
    }
    await onSend(values.content);
    reset();
  }

  return (
    <Card className="border-t border-border bg-background/90 p-3 shadow-none backdrop-blur-xl md:p-4">
      <form className="flex items-end gap-3" onSubmit={handleSubmit(submit)}>
        <Button aria-label="Attach file" disabled size="sm" variant="secondary" type="button" onClick={onRequireAuth}>
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button aria-label="Voice input" disabled size="sm" variant="secondary" type="button" onClick={onRequireAuth}>
          <Volume2 className="h-4 w-4" />
        </Button>
        <div className="flex-1" onClick={onRequireAuth}>
          <Input
            aria-label="Message input"
            placeholder={onRequireAuth ? 'Sign in to ask about care plans, medication routines, or next steps' : 'Ask about care plans, medication routines, or next steps'}
            {...register('content')}
            disabled={!onRequireAuth && (isDisabled || isSubmitting)}
            readOnly={Boolean(onRequireAuth)}
            className={onRequireAuth ? 'cursor-pointer' : undefined}
          />
          {errors.content ? <p className="mt-2 text-xs text-danger">{errors.content.message}</p> : null}
        </div>
        <Button
          aria-label="Send message"
          size="sm"
          type={onRequireAuth ? 'button' : 'submit'}
          disabled={!onRequireAuth && (isDisabled || isSubmitting)}
          onClick={onRequireAuth}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}