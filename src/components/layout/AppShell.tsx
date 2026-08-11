import type { ReactNode } from "react";
import Link from "next/link";

import { OfflineBanner } from "./OfflineBanner";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link href="/dashboard">Tally</Link>
      </header>
      <nav aria-label="Main navigation" className="app-nav">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/applications">Applications</Link>
        <Link href="/interviews">Interviews</Link>
        <Link href="/settings">Settings</Link>
      </nav>
      <OfflineBanner />
      <main id="main-content">{children}</main>
    </div>
  );
}
