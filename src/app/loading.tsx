import { AppSkeleton } from "@/components/app-ui";

export default function Loading() {
  return (
    <main id="main-content" aria-busy="true" aria-live="polite">
      <h1 className="sr-only">Loading Tally</h1>
      <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-8 sm:px-6 lg:px-8" role="status">
        <AppSkeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><AppSkeleton className="h-28" /><AppSkeleton className="h-28" /><AppSkeleton className="h-28" /><AppSkeleton className="h-28" /></div>
        <AppSkeleton className="h-56 w-full" />
        <span className="sr-only">Loading content…</span>
      </div>
    </main>
  );
}
