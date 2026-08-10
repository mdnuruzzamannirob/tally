"use client";

import { useEffect } from "react";

import { clearSession, setCurrentUser } from "@/store/slices/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import { useCurrentUserQuery } from "@/store/api/auth.api";

export function SessionBootstrap() {
  const dispatch = useAppDispatch();
  const { data, isError, isSuccess } = useCurrentUserQuery();
  useEffect(() => {
    if (isSuccess && data) dispatch(setCurrentUser(data));
    if (isError) dispatch(clearSession());
  }, [data, dispatch, isError, isSuccess]);
  return null;
}
