import { baseApi } from "./base-api";
import type { ApiEnvelope, ApiMeta } from "@/types/api.types";
import type { Application } from "@/types/application.types";

interface ApplicationList {
  items: Application[];
  pagination?: ApiMeta;
}

export const applicationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    applications: build.query<{ data: ApplicationList; meta?: ApiMeta }, URLSearchParams | void>({
      query: (params) => ({
        url: "/applications",
        ...(params ? { params: Object.fromEntries(params.entries()) } : {}),
      }),
      transformResponse: (response: ApiEnvelope<ApplicationList>) => {
        if (!response.success) throw new Error(response.message);
        return { data: response.data, meta: response.meta };
      },
      providesTags: (result) => [
        "Application",
        ...(result?.data.items.map(({ id }) => ({ type: "Application" as const, id })) ?? []),
      ],
    }),
  }),
});

export const { useApplicationsQuery } = applicationsApi;
