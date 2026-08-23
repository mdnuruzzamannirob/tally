import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { clearSession, setSession } from "@/store/slices/auth.slice";
import type { ApiEnvelope } from "@/types/api.types";
import type { AuthSession } from "@/types/auth.types";
import { webEnv } from "@/lib/env";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: webEnv.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState, arg }) => {
    const accessToken = (getState() as { auth: { accessToken: string | null } }).auth.accessToken;
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    const url = typeof arg === "string" ? arg : arg.url;
    if (url === "/auth/refresh" || url === "/auth/logout") {
      headers.set("X-Requested-With", "XMLHttpRequest");
    }
    return headers;
  },
});

let refreshPromise: Promise<AuthSession | null> | null = null;

const refreshSession = async (
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
): Promise<AuthSession | null> => {
  const refreshResult = await rawBaseQuery(
    {
      url: "/auth/refresh",
      method: "POST",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    },
    api,
    extraOptions,
  );
  const refreshBody = refreshResult.data as ApiEnvelope<{ accessToken: string }> | undefined;
  if (!refreshBody?.success) return null;

  const meResult = await rawBaseQuery(
    {
      url: "/auth/me",
      headers: { Authorization: `Bearer ${refreshBody.data.accessToken}` },
    },
    api,
    extraOptions,
  );
  const meBody = meResult.data as ApiEnvelope<AuthSession["user"]> | undefined;
  if (!meBody?.success) return null;
  return { accessToken: refreshBody.data.accessToken, user: meBody.data };
};

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  const url = typeof args === "string" ? args : args.url;
  if (result.error?.status !== 401 || url === "/auth/refresh" || url === "/auth/logout") {
    return result;
  }

  refreshPromise ??= refreshSession(api, extraOptions).finally(() => {
    refreshPromise = null;
  });
  const session = await refreshPromise;
  if (!session) {
    api.dispatch(clearSession());
    return result;
  }

  api.dispatch(setSession(session));
  result = await rawBaseQuery(args, api, extraOptions);
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "Application",
    "Applications",
    "Dashboard",
    "Interview",
    "Interviews",
    "Note",
    "Notes",
    "Tag",
    "Tags",
    "StatusHistory",
    "User",
  ],
  endpoints: () => ({}),
});
