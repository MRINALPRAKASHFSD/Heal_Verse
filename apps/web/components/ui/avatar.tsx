import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Avatar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-medical text-sm font-semibold text-primary-foreground',
        className,
      )}
      {...props}
    />
  );
}