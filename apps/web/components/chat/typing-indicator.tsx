import { Card } from '@/components/ui';

export function TypingIndicator() {
  return (
    <Card className="inline-flex items-center gap-2 px-4 py-3">
      <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
      <span className="text-sm text-muted-foreground">Thinking...</span>
    </Card>
  );
}