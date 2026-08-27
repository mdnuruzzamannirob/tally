"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAppSelector } from "@/store/hooks";

export function SocialCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get("status");
  const intent = params.get("intent");
  const { initialized, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (status !== "success") {
      router.replace("/login?oauth=error");
      return;
    }

    if (!initialized) return;
    if (!user) {
      router.replace("/login?oauth=error");
      return;
    }

    router.replace(
      intent === "link"
        ? "/settings"
        : user.preferences.defaultLandingPage === "applications"
          ? "/applications"
          : "/dashboard",
    );
  }, [initialized, intent, router, status, user]);

  return <p aria-live="polite">Completing sign-in...</p>;
}
