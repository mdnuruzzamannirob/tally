import { AppSkeleton } from "@/components/app-ui";

export default function Loading() {
  return (
    <main id="main-content" aria-busy="true" aria-live="polite">
      <h1 className="sr-only">Loading Tally</h1>
      <div className="stack" role="status">
        <AppSkeleton className="h-8 w-48" />
        <AppSkeleton className="h-24 w-full" />
        <AppSkeleton className="h-24 w-full" />
        <span className="sr-only">Loading content…</span>
      </div>
    </main>
  );
}
