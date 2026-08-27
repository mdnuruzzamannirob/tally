import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { clearSession, setAccessToken } from "@/store/slices/auth.slice";
import type { ApiEnvelope } from "@/types/api.types";
import { webEnv } from "@/lib/env";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: webEnv.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState, arg }) => {
    const accessToken = (getState() as { auth: { accessToken: string | null } }).auth.accessToken;
    const url = typeof arg === "string" ? arg : arg.url;
    if (
      accessToken &&
      !headers.has("Authorization") &&
      url !== "/auth/refresh" &&
      url !== "/auth/logout"
    ) {
      headers.set("Authorization", "Bearer " + accessToken);
    }
    if (url === "/auth/refresh" || url === "/auth/logout") {
      headers.set("X-Requested-With", "XMLHttpRequest");
    }
    return headers;
  },
});

type RefreshOutcome =
  { accessToken: string; error?: never } | { accessToken: null; error: FetchBaseQueryError };

const refreshAccessToken = async (
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
): Promise<RefreshOutcome> => {
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
  if (refreshBody?.success) {
    return { accessToken: refreshBody.data.accessToken };
  }
  return {
    accessToken: null,
    error: refreshResult.error ?? {
      status: 401,
      data: refreshBody,
    },
  };
};

let refreshPromise: Promise<RefreshOutcome> | null = null;

const getRefreshOutcome = (
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
) => {
  refreshPromise ??= refreshAccessToken(api, extraOptions).finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
};

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const url = typeof args === "string" ? args : args.url;
  const authState = api.getState() as {
    auth: { accessToken: string | null; initialized: boolean };
  };
  const shouldBootstrapSession = url === "/auth/me" && !authState.auth.initialized;

  let result;
  if (shouldBootstrapSession) {
    // The access token is memory-only. Restore it before the first /auth/me
    // request so a browser reload produces exactly refresh -> me.
    const refresh = await getRefreshOutcome(api, extraOptions);
    if (!refresh.accessToken) {
      api.dispatch(clearSession());
      return {
        error: refresh.error ?? {
          status: 401,
          data: undefined,
        },
      };
    }
    api.dispatch(setAccessToken(refresh.accessToken));
    result = await rawBaseQuery(args, api, extraOptions);
  } else {
    result = await rawBaseQuery(args, api, extraOptions);
  }

  if (result.error?.status !== 401 || url === "/auth/refresh" || url === "/auth/logout") {
    return result;
  }

  const errorCode =
    typeof result.error.data === "object" &&
    result.error.data !== null &&
    "error" in result.error.data
      ? (result.error.data as { error?: { code?: unknown } }).error?.code
      : undefined;
  // Only an explicit expired-token response can trigger runtime refresh.
  // Other 401s are application errors and must reach the caller unchanged.
  if (errorCode !== "TOKEN_EXPIRED") return result;

  const refresh = await getRefreshOutcome(api, extraOptions);
  if (!refresh.accessToken) {
    api.dispatch(clearSession());
    return result;
  }

  api.dispatch(setAccessToken(refresh.accessToken));
  return rawBaseQuery(args, api, extraOptions);
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
