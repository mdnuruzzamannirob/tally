"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAppSelector } from "@/store/hooks";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { initialized, user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (initialized && !user) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [initialized, pathname, router, user]);
  if (!initialized || !user) return <p aria-live="polite">Loading your session…</p>;
  if (!user.emailVerified) return <p>Your email must be verified before accessing Tally.</p>;
  return <>{children}</>;
}
