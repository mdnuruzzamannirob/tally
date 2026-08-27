"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAppSelector } from "@/store/hooks";
import { AuthRouteLoading } from "./AuthRouteLoading";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { initialized, user } = useAppSelector((state) => state.auth);
  // useEffect(() => {
  //   if (initialized && !user) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  // }, [initialized, pathname, router, user]);
  // if (!initialized || !user) return <p aria-live="polite">Loading your session...</p>;
  // if (!user.emailVerified) return <p>Your email must be verified before accessing Tally.</p>;
  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!user.emailVerified)
      router.replace(`/verify-email?email=${encodeURIComponent(user.email)}`);
  }, [initialized, pathname, router, user]);
  if (!initialized || !user) return <AuthRouteLoading />;
  if (!user.emailVerified) return <AuthRouteLoading />;
  return <>{children}</>;
}
