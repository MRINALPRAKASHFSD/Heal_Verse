import { AppShell } from '@/components/layout/app-shell';

export default async function HomePage({ searchParams }: { searchParams?: Promise<{ conversationId?: string }> }) {
  const resolvedParams = await searchParams;
  return <AppShell initialConversationId={resolvedParams?.conversationId} />;
}