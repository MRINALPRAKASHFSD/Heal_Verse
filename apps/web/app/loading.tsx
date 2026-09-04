export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-24 text-foreground">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="h-12 w-72 animate-pulse rounded-2xl bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded-full bg-muted" />
        <div className="h-4 w-80 animate-pulse rounded-full bg-muted" />
      </div>
    </main>
  );
}