"use client";

import { useAppSelector } from "@/store/hooks";
import { AuthRouteLoading } from "./AuthRouteLoading";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { initialized, user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (!initialized || !user?.emailVerified) return;
    router.replace(
      user.preferences.defaultLandingPage === "applications" ? "/applications" : "/dashboard",
    );
  }, [initialized, router, user]);
  if (initialized && user?.emailVerified) return <AuthRouteLoading />;
  return <>{children}</>;
}
