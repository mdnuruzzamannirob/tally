"use client";

import { RefreshCw, WifiOff } from "lucide-react";
import { AppButton, AppCard } from "@/components/app-ui";

export default function OfflinePage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10">
      <AppCard className="w-full max-w-[420px] text-center" padding="lg">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-warning-soft text-warning-text"><WifiOff className="size-6" /></span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">You&apos;re offline</h1>
        <p className="mt-2 text-sm text-muted-foreground">Some features may be unavailable. Reconnect and try again to access your latest Tally data.</p>
        <AppButton className="mt-6 w-full" onClick={() => window.location.reload()}><RefreshCw className="size-4" /> Retry connection</AppButton>
      </AppCard>
    </main>
  );
}
