'use client';

import { Monitor, MoonStar, SunMedium } from 'lucide-react';
import { Button } from './button';
import { useTheme } from '@/providers/theme-provider';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const activeTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <div className="inline-flex rounded-full border border-border bg-card p-1">
      <Button
        aria-label="Use light theme"
        className="h-9 w-9 rounded-full px-0"
        variant={activeTheme === 'light' ? 'primary' : 'ghost'}
        onClick={() => setTheme('light')}
      >
        <SunMedium className="h-4 w-4" />
      </Button>
      <Button
        aria-label="Use dark theme"
        className="h-9 w-9 rounded-full px-0"
        variant={activeTheme === 'dark' ? 'primary' : 'ghost'}
        onClick={() => setTheme('dark')}
      >
        <MoonStar className="h-4 w-4" />
      </Button>
      <Button
        aria-label="Use system theme"
        className="h-9 w-9 rounded-full px-0"
        variant={theme === 'system' ? 'primary' : 'ghost'}
        onClick={() => setTheme('system')}
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
}