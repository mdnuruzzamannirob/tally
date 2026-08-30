import { baseApi } from "./base-api";
import type { ApiEnvelope } from "@/types/api.types";
import type { User, UpdateProfileInput, UserPreferences } from "@/types/user.types";
const unwrap = <T>(response: ApiEnvelope<T>) => {
  if (!response.success) throw new Error(response.message);
  return response.data;
};
export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    updateProfile: build.mutation<User, UpdateProfileInput>({
      query: (body) => ({ url: "/users/me/profile", method: "PATCH", body }),
      transformResponse: unwrap,
      invalidatesTags: ["Auth", "User"],
    }),
    updatePreferences: build.mutation<User, Partial<UserPreferences>>({
      query: (body) => ({ url: "/users/me/preferences", method: "PATCH", body }),
      transformResponse: unwrap,
      invalidatesTags: ["Auth", "User", "Dashboard"],
    }),
  }),
});
export const { useUpdateProfileMutation, useUpdatePreferencesMutation } = usersApi;
