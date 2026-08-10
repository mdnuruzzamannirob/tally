import { baseApi } from "./base-api";
import type { ApiEnvelope } from "@/types/api.types";
import type { AuthSession, CurrentUser } from "@/types/auth.types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthSession, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response: ApiEnvelope<AuthSession>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
      invalidatesTags: ["Auth"],
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST", headers: { "X-Requested-With": "XMLHttpRequest" } }),
      invalidatesTags: ["Auth"],
    }),
    currentUser: build.query<CurrentUser, void>({
      query: () => "/auth/me",
      transformResponse: (response: ApiEnvelope<{ user: CurrentUser }>) => {
        if (!response.success) throw new Error(response.message);
        return response.data.user;
      },
      providesTags: ["Auth"],
    }),
  }),
});

export const { useCurrentUserQuery, useLoginMutation, useLogoutMutation } = authApi;
