"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function SocialCallback() {
  const router = useRouter();
  const params = useSearchParams();
  useEffect(() => {
    router.replace(params.get("status") === "success" ? "/dashboard" : "/login");
  }, [params, router]);
  return <p aria-live="polite">Completing sign-in…</p>;
}
