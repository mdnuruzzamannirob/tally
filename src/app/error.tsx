"use client";

import { RefreshCw } from "lucide-react";
import { AppButton } from "@/components/app-ui";
import { TallyLogo } from "@/components/shared/TallyLogo";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="relative flex min-h-svh items-center justify-center bg-background px-6" id="main-content" role="alert">
      <section className="w-full max-w-sm text-center">
        <TallyLogo className="absolute left-1/2 top-6 -translate-x-1/2 text-xl" aria-hidden="true" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">We couldn&apos;t load this page. Please try again.</p>
        <AppButton className="mt-6" onClick={reset}><RefreshCw className="size-4" /> Try again</AppButton>
      </section>
    </main>
  );
}
