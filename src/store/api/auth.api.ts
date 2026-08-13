import { baseApi } from "./base-api";
import type { ApiEnvelope } from "@/types/api.types";
import type { AuthSession, CurrentUser } from "@/types/auth.types";

type MessageResponse = Record<string, never>;

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
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        headers: { "X-Requested-With": "XMLHttpRequest" },
      }),
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
  }),
});

export const {
  useCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
