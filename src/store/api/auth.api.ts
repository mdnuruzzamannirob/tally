import { baseApi } from "./base-api";
import type { ApiEnvelope } from "@/types/api.types";
import type { AuthSession, CurrentUser } from "@/types/auth.types";
import type { AccessTokenResponse, ConnectedAccounts } from "@/types/auth.types";

type MessageResponse = Record<string, never>;

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    refresh: build.mutation<AccessTokenResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
        headers: { "X-Requested-With": "XMLHttpRequest" },
      }),
      transformResponse: (response: ApiEnvelope<AccessTokenResponse>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
    }),
    login: build.mutation<AuthSession, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response: ApiEnvelope<AuthSession>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
      invalidatesTags: ["Auth"],
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        headers: { "X-Requested-With": "XMLHttpRequest" },
      }),
      invalidatesTags: ["Auth"],
    }),
    currentUser: build.query<CurrentUser, void>({
      query: () => "/auth/me",
      transformResponse: (response: ApiEnvelope<CurrentUser>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
      providesTags: ["Auth"],
    }),
    register: build.mutation<MessageResponse, { name?: string; email: string; password: string }>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (response: ApiEnvelope<MessageResponse>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
    }),
    verifyEmail: build.mutation<MessageResponse, { token: string }>({
      query: (body) => ({ url: "/auth/verify-email", method: "POST", body }),
      transformResponse: (response: ApiEnvelope<MessageResponse>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
    }),
    resendVerification: build.mutation<MessageResponse, { email: string }>({
      query: (body) => ({ url: "/auth/resend-verification", method: "POST", body }),
      transformResponse: (response: ApiEnvelope<MessageResponse>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
    }),
    forgotPassword: build.mutation<MessageResponse, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
      transformResponse: (response: ApiEnvelope<MessageResponse>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
    }),
    resetPassword: build.mutation<MessageResponse, { token: string; password: string }>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
      transformResponse: (response: ApiEnvelope<MessageResponse>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
    }),
    changePassword: build.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: "/auth/change-password", method: "PATCH", body }),
      transformResponse: (response: ApiEnvelope<MessageResponse>) => {
        if (!response.success) throw new Error(response.message);
        return undefined;
      },
      invalidatesTags: ["Auth"],
    }),
    setPassword: build.mutation<MessageResponse, { newPassword: string }>({
      query: (body) => ({ url: "/auth/set-password", method: "POST", body }),
      transformResponse: (response: ApiEnvelope<MessageResponse>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
      invalidatesTags: ["Auth"],
    }),
    connectedAccounts: build.query<ConnectedAccounts, void>({
      query: () => "/auth/connected-accounts",
      transformResponse: (response: ApiEnvelope<ConnectedAccounts>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
      providesTags: ["Auth"],
    }),
    linkConnectedAccount: build.mutation<{ authorizationUrl: string }, "google" | "github">({
      query: (provider) => ({ url: `/auth/connected-accounts/${provider}/link`, method: "POST" }),
      transformResponse: (response: ApiEnvelope<{ authorizationUrl: string }>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
    }),
    unlinkConnectedAccount: build.mutation<void, "google" | "github">({
      query: (provider) => ({ url: `/auth/connected-accounts/${provider}`, method: "DELETE" }),
      transformResponse: (response: ApiEnvelope<MessageResponse>) => {
        if (!response.success) throw new Error(response.message);
        return undefined;
      },
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useCurrentUserQuery,
  useLazyCurrentUserQuery,
  useRefreshMutation,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useSetPasswordMutation,
  useConnectedAccountsQuery,
  useLinkConnectedAccountMutation,
  useUnlinkConnectedAccountMutation,
} = authApi;
