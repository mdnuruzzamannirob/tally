"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppButton } from "@/components/app-ui";
import { TallyLogo } from "@/components/shared/TallyLogo";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh items-center justify-center bg-background px-6" id="main-content">
      <section className="w-full max-w-sm text-center">
        <TallyLogo className="absolute left-1/2 top-6 -translate-x-1/2 text-xl" aria-hidden="true" />
        <p className="text-5xl font-semibold tracking-tight text-muted-foreground/40">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The page you requested doesn&apos;t exist.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/"><AppButton><ArrowLeft className="size-4" /> Go home</AppButton></Link>
          <AppButton variant="outline" onClick={() => window.history.back()}>Go back</AppButton>
        </div>
      </section>
    </main>
  );
}
