"use client";

import { RefreshCw } from "lucide-react";
import { TallyLogo } from "@/components/shared/TallyLogo";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main
          className="relative flex min-h-svh items-center justify-center bg-slate-50 px-6 text-slate-900"
          id="main-content"
          role="alert"
        >
          <section className="w-full max-w-sm text-center">
            <TallyLogo
              className="absolute left-1/2 top-6 -translate-x-1/2 text-lg text-indigo-600"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-500">
              We couldn&apos;t start Tally. Please try again.
            </p>
            <button
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700"
              type="button"
              onClick={reset}
            >
              <RefreshCw className="size-4" /> Reload Tally
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
