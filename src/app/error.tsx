"use client";

import { AppButton, AppCard } from "@/components/app-ui";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10" id="main-content" role="alert">
      <AppCard className="w-full max-w-[420px] text-center" padding="lg">
        <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">We could not load this page. Please try again.</p>
        <AppButton className="mt-6 w-full" onClick={reset}>Try again</AppButton>
      </AppCard>
    </main>
  );
}
