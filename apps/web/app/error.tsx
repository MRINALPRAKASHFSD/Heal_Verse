'use client';

import { ErrorState } from '@/components/ui';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <ErrorState description={error.message} onRetry={reset} title="Something went wrong" />
    </main>
  );
}
