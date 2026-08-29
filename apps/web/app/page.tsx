import { AppShell } from '@/components/layout/app-shell';
import { mockChatSession } from '@/features/chat/mock-data';

export default function HomePage() {
  return <AppShell session={mockChatSession} />;
}