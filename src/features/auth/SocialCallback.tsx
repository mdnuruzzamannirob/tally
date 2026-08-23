"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setAccessToken, setSession } from "@/store/slices/auth.slice";
import { useLazyCurrentUserQuery, useRefreshMutation } from "@/store/api/auth.api";

export function SocialCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useAppDispatch();
  const [refresh] = useRefreshMutation();
  const [loadUser] = useLazyCurrentUserQuery();
  useEffect(() => {
    let active = true;
    const status = params.get("status");
    const intent = params.get("intent");
    if (status !== "success") {
      router.replace("/login?oauth=error");
      return () => { active = false; };
    }
    void refresh()
      .unwrap()
      .then(async ({ accessToken }) => {
        dispatch(setAccessToken(accessToken));
        const user = await loadUser().unwrap();
        if (!active) return;
        dispatch(setSession({ accessToken, user }));
        router.replace(intent === "link" ? "/settings" : user.preferences.defaultLandingPage === "applications" ? "/applications" : "/dashboard");
      })
      .catch(() => router.replace("/login?oauth=error"));
    return () => { active = false; };
  }, [dispatch, loadUser, params, refresh, router]);
  return <p aria-live="polite">Completing sign-in…</p>;
}
