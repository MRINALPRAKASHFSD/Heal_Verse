'use client';

import type { ReactNode } from 'react';

export function Dropdown({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <details className="group relative">
      <summary className="list-none cursor-pointer">{label}</summary>
      <div className="absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl group-open:block">
        {children}
      </div>
    </details>
  );
}