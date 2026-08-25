"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-[100dvh] items-center justify-center bg-[#f8fafc] px-4 py-10 text-[#0f172a]" id="main-content" role="alert">
          <section className="w-full max-w-[420px] rounded-lg border border-[#e2e8f0] bg-white p-6 text-center shadow-none">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-[#64748b]">There was a problem starting Tally. Please try again.</p>
            <button className="mt-6 h-9 w-full rounded-md bg-[#6366f1] px-3 text-sm font-medium text-white hover:bg-[#4f46e5]" type="button" onClick={reset}>
              Reload Tally
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
