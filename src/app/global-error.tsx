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
        <main id="main-content" role="alert">
          <h1>Something went wrong</h1>
          <p>There was a problem starting Tally. Please try again.</p>
          <button type="button" onClick={reset}>
            Reload Tally
          </button>
        </main>
      </body>
    </html>
  );
}
