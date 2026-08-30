"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { AuthRouteLoading } from "./AuthRouteLoading";

export function RootRedirect() {
  const router = useRouter();
  const { initialized, user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (!initialized) return;
    if (!user) router.replace("/login");
    else if (!user.emailVerified)
      router.replace(`/verify-email?email=${encodeURIComponent(user.email)}`);
    else
      router.replace(
        user.preferences.defaultLandingPage === "applications" ? "/applications" : "/dashboard",
      );
  }, [initialized, router, user]);
  return <AuthRouteLoading />;
}
