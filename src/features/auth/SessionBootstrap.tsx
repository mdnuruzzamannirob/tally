"use client";

import { useEffect, useRef } from "react";

import { useAppDispatch } from "@/store/hooks";
import { clearSession, setCurrentUser } from "@/store/slices/auth.slice";
import { useLazyCurrentUserQuery } from "@/store/api/auth.api";

export function SessionBootstrap() {
  const dispatch = useAppDispatch();
  const [loadUser] = useLazyCurrentUserQuery();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // baseQueryWithReauth restores the access token before /auth/me after a
    // full reload. The callback page waits for this same request to finish.
    void loadUser()
      .unwrap()
      .then((user) => {
        dispatch(setCurrentUser(user));
      })
      .catch(() => {
        dispatch(clearSession());
      });
  }, [dispatch, loadUser]);

  return null;
}
