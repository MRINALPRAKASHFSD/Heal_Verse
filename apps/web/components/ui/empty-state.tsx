import { Card } from './card';

export function EmptyState({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <Card className="mx-auto max-w-2xl p-8 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      {children ? <div className="mt-4 flex justify-center">{children}</div> : null}
    </Card>
  );
}