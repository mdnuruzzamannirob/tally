import { TallyLogo } from "@/components/shared/TallyLogo";
export default function Loading() {
  return (
    <main
      className="relative flex min-h-svh w-full items-center justify-center bg-background"
      id="main-content"
      aria-busy="true"
      aria-live="polite"
    >
      <TallyLogo className="absolute left-1/2 top-6 -translate-x-1/2 text-2xl" aria-hidden="true" />
      <div className="flex flex-col items-center gap-3" role="status">
        <div
          className="size-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
          aria-hidden="true"
        />
        <span className="text-sm text-muted-foreground">Loading...</span>
        <span className="sr-only">Loading Tally...</span>
      </div>
    </main>
  );
}
