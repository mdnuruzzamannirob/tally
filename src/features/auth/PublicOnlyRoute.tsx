"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { initialized, user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (!initialized || !user?.emailVerified) return;
    router.replace(user.preferences.defaultLandingPage === "applications" ? "/applications" : "/dashboard");
  }, [initialized, router, user]);
  if (!initialized) return <p aria-live="polite">Loading your session...</p>;
  if (user?.emailVerified) return <p aria-live="polite">Redirecting...</p>;
  return <>{children}</>;
}
