"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useAppSelector } from "@/store/hooks";
import { AuthCard, AuthHeader, AuthLayout } from "./AuthLayout";

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

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title={intent === "link" ? "Connecting account..." : "Signing in..."}
          description={
            intent === "link"
              ? "We're connecting your social account to Tally."
              : "Completing your sign-in to Tally."
          }
        />
        <div className="flex justify-center pt-8">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-border border-t-primary animate-spin" />
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground" aria-live="polite">
          {intent === "link"
            ? "Please wait while we connect your account..."
            : "Please wait while we complete your sign-in..."}
        </p>
      </AuthCard>
    </AuthLayout>
  );
}
