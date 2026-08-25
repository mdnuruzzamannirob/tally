import type { ReactNode } from "react";

import { AppCard } from "@/components/app-ui";
import { cn } from "@/lib/utils";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8 sm:px-6 sm:py-10">
      <a className="fixed top-2 left-2 z-50 -translate-y-20 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-transform focus:translate-y-0" href="#auth-content">Skip to content</a>
      <div className="w-full" id="auth-content">
      {children}
      </div>
    </main>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <AppCard padding="none" className="mx-auto w-full max-w-[420px] p-5 sm:p-8">
      {children}
    </AppCard>
  );
}

export function AuthHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <header className="mb-6 text-center">
      <div
        className={cn(
          "mx-auto mb-4 grid size-12 place-items-center rounded-lg bg-primary text-lg font-bold text-primary-foreground",
          icon && "bg-primary-soft text-primary ring-1 ring-primary/20",
        )}
      >
        {icon ?? "T"}
      </div>
      <h1 className="text-[22px] font-bold tracking-tight text-foreground">{title}</h1>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
    </header>
  );
}

export function AuthFooter({ children }: { children: ReactNode }) {
  return <p className="mt-5 text-center text-sm text-muted-foreground">{children}</p>;
}

export function AuthDivider() {
  return (
    <div className="my-2 flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
      or continue with
    </div>
  );
}
