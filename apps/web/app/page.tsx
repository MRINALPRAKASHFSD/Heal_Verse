import { AppShell } from '@/components/layout/app-shell';

export default function HomePage({ searchParams }: { searchParams?: { conversationId?: string } }) {
  return <AppShell initialConversationId={searchParams?.conversationId} />;
}