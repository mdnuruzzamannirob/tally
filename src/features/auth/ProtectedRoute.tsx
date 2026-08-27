"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAppSelector } from "@/store/hooks";
import { AuthRouteLoading } from "./AuthRouteLoading";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { initialized, user } = useAppSelector((state) => state.auth);
  // useEffect(() => {
  //   if (initialized && !user) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  // }, [initialized, pathname, router, user]);
  // if (!initialized || !user) return <p aria-live="polite">Loading your sessionÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦</p>;
  // if (!user.emailVerified) return <p>Your email must be verified before accessing Tally.</p>;
  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!user.emailVerified) router.replace(`/verify-email?email=${encodeURIComponent(user.email)}`);
  }, [initialized, pathname, router, user]);
  if (!initialized || !user) return <AuthRouteLoading />;
  if (!user.emailVerified) return <AuthRouteLoading />;
  return <>{children}</>;
}

