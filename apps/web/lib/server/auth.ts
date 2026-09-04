import { getDefaultApiRuntime } from '@/lib/server/api/runtime';
import type { BetterAuthAdapter, BetterAuthInstance } from '@healverse/infrastructure';

export function getServerAuthAdapter(): BetterAuthAdapter {
  const runtime = getDefaultApiRuntime();
  return runtime.container.authAdapter;
}

export function getServerAuth(): BetterAuthInstance {
  return getServerAuthAdapter().getAuth();
}
