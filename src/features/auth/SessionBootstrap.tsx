"use client";

import { useEffect, useRef } from "react";

import { useAppDispatch } from "@/store/hooks";
import { clearSession, setSession } from "@/store/slices/auth.slice";
import { useLazyCurrentUserQuery, useRefreshMutation } from "@/store/api/auth.api";

export function SessionBootstrap() {
  const dispatch = useAppDispatch();
  const [refresh] = useRefreshMutation();
  const [loadUser] = useLazyCurrentUserQuery();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    void refresh()
      .unwrap()
      .then(async ({ accessToken }) => {
        const user = await loadUser().unwrap();
        dispatch(setSession({ accessToken, user }));
      })
      .catch(() => {
        dispatch(clearSession());
      });
  }, [dispatch, loadUser, refresh]);

  return null;
}
