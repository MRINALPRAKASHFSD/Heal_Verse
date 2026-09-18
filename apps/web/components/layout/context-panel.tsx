import { Card } from '@/components/ui';

export function ContextPanel({ collapsed, isAuthenticated }: { collapsed: boolean; isAuthenticated?: boolean }) {
  if (collapsed) {
    return null;
  }

  return (
    <aside className="hidden h-screen border-l border-border bg-card/85 p-4 backdrop-blur-xl xl:block xl:w-[20rem]">
      {isAuthenticated ? (
        <>
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Context</p>
            <h2 className="mt-3 text-lg font-semibold">Conversation summary</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Space for timeline, care notes, reminders, or future context surfaces. This panel is UI-only for now.
            </p>
          </Card>
          <Card className="mt-4 p-4">
            <p className="text-sm font-medium">Safe, calm, and minimal</p>
            <p className="mt-2 text-sm text-muted-foreground">Designed for clinical trust without visual noise.</p>
          </Card>
        </>
      ) : (
        <>
          <Card className="p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Care Workspace</p>
            <h2 className="mt-3 text-lg font-semibold">Private & Secure</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              HealVerse provides session-authenticated, private care planning and conversation support designed for clinical trust.
            </p>
          </Card>
          <Card className="mt-4 p-4">
            <p className="text-sm font-medium">Protected Health Information</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Conversations and care reminders are strictly isolated and encrypted to your personal session.
            </p>
          </Card>
        </>
      )}
    </aside>
  );
}