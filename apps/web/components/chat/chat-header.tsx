import { Bell, Menu, PanelRightClose, PanelRightOpen, Search } from 'lucide-react';
import { Button, Input, ThemeToggle } from '@/components/ui';

export function ChatHeader({
  title,
  onOpenSidebar,
  onToggleContext,
  contextOpen,
}: {
  title: string;
  onOpenSidebar: () => void;
  onToggleContext: () => void;
  contextOpen: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <Button aria-label="Open navigation" className="md:hidden" variant="ghost" onClick={onOpenSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
          <p className="truncate text-xs text-muted-foreground">Calm, private, and accessible care support</p>
        </div>
        <div className="hidden min-w-0 flex-1 max-w-md items-center gap-2 lg:flex">
          <Search className="absolute ml-4 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search within this conversation" />
        </div>
        <Button aria-label="Notifications" variant="ghost">
          <Bell className="h-5 w-5" />
        </Button>
        <Button aria-label="Toggle context panel" variant="ghost" onClick={onToggleContext}>
          {contextOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}