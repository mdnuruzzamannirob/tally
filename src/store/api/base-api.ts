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

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as { auth: { accessToken: string | null } }).auth.accessToken;
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    return headers;
  },
});

let refreshPromise: Promise<AuthSession | null> | null = null;

const refreshSession = async (
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
): Promise<AuthSession | null> => {
  const refreshResult = await rawBaseQuery({ url: "/auth/refresh", method: "POST" }, api, extraOptions);
  const refreshBody = refreshResult.data as ApiEnvelope<{ accessToken: string }> | undefined;
  if (!refreshBody?.success) return null;

  const meResult = await rawBaseQuery({ url: "/auth/me" }, api, extraOptions);
  const meBody = meResult.data as ApiEnvelope<{ user: AuthSession["user"] }> | undefined;
  if (!meBody?.success) return null;
  return { accessToken: refreshBody.data.accessToken, user: meBody.data.user };
};

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status !== 401) return result;

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
  tagTypes: ["Auth", "Application", "Dashboard", "Interview", "Note", "Tag", "User"],
  endpoints: () => ({}),
});
