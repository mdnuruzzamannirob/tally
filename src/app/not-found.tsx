import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content">
      <h1>Page not found</h1>
      <p className="muted">The page you requested does not exist.</p>
      <Link href="/dashboard">Return to Tally</Link>
    </main>
  );
}
