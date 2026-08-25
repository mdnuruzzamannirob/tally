import Link from "next/link";
import { AppButton, AppCard } from "@/components/app-ui";
export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10" id="main-content">
      <AppCard className="w-full max-w-[420px] text-center" padding="lg">
        <p className="text-sm font-semibold text-primary">404</p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The page you requested does not exist.</p>
        <Link className="mt-6 inline-flex w-full" href="/dashboard"><AppButton className="w-full">Return to Tally</AppButton></Link>
      </AppCard>
    </main>
  );
}
