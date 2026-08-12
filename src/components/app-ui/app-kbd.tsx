import type { ReactNode } from 'react';
export function AppKbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-6 items-center justify-center rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
      {children}
    </kbd>
  );
}
