import { baseApi } from "./base-api";
import type { ApiEnvelope } from "@/types/api.types";
import type { DashboardSummary } from "@/types/dashboard.types";
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    dashboard: build.query<DashboardSummary, void>({
      query: () => "/dashboard",
      transformResponse: (response: ApiEnvelope<DashboardSummary>) => {
        if (!response.success) throw new Error(response.message);
        return response.data;
      },
      providesTags: ["Dashboard"],
    }),
  }),
});
export const { useDashboardQuery } = dashboardApi;
