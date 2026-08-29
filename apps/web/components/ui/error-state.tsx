import { Card } from './card';
import { Button } from './button';

export function ErrorState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="mx-auto max-w-2xl p-8 text-center">
      <h2 className="text-xl font-semibold text-danger">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      <Button className="mt-6" variant="secondary">
        Try again
      </Button>
    </Card>
  );
}