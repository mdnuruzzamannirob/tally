import { baseApi } from "./base-api";
import type { ApiEnvelope, ApiMeta } from "@/types/api.types";
import type {
  Application,
  ApplicationListQuery,
  ChangeApplicationStatusInput,
  CreateApplicationInput,
  StatusHistoryEntry,
  UpdateApplicationInput,
} from "@/types/application.types";

export interface Paginated<T> {
  items: T[];
  meta?: ApiMeta;
}
function queryParams(
  input?: ApplicationListQuery | URLSearchParams,
): Record<string, string> | undefined {
  if (!input) return undefined;
  if (input instanceof URLSearchParams) return Object.fromEntries(input.entries());
  const entries = Object.entries(input).filter(([, value]) => value !== undefined && value !== "");
  return entries.length
    ? Object.fromEntries(entries.map(([key, value]) => [key, String(value)]))
    : undefined;
}
function unwrap<T>(response: ApiEnvelope<T>): T {
  if (!response.success) throw new Error(response.message);
  return response.data;
}
function normalizeApplication(value: Application): Application {
  const raw = value as Application & {
    tags?: Array<{ tag?: Application["tags"][number] } | Application["tags"][number]>;
  };
  return {
    ...value,
    tags: (raw.tags ?? []).map((item) => {
      const candidate = item as { tag?: Application["tags"][number] };
      return candidate.tag ?? (item as Application["tags"][number]);
    }),
  };
}

export const applicationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    applications: build.query<
      Paginated<Application>,
      ApplicationListQuery | URLSearchParams | undefined
    >({
      query: (params) => ({ url: "/applications", params: queryParams(params) }),
      transformResponse: (response: ApiEnvelope<Application[]>) => ({
        items: unwrap(response).map(normalizeApplication),
        meta: response.success ? response.meta : undefined,
      }),
      providesTags: (result) => [
        "Applications",
        ...(result?.items.map(({ id }) => ({ type: "Application" as const, id })) ?? []),
      ],
    }),
    application: build.query<Application, string>({
      query: (id) => `/applications/${id}`,
      transformResponse: (response: ApiEnvelope<Application>) =>
        normalizeApplication(unwrap(response)),
      providesTags: (_result, _error, id) => [{ type: "Application", id }],
    }),
    createApplication: build.mutation<Application, CreateApplicationInput>({
      query: (body) => ({ url: "/applications", method: "POST", body }),
      transformResponse: (response: ApiEnvelope<Application>) =>
        normalizeApplication(unwrap(response)),
      invalidatesTags: ["Applications", "Dashboard", "Tags"],
    }),
    updateApplication: build.mutation<Application, { id: string; body: UpdateApplicationInput }>({
      query: ({ id, body }) => ({ url: `/applications/${id}`, method: "PATCH", body }),
      transformResponse: (response: ApiEnvelope<Application>) =>
        normalizeApplication(unwrap(response)),
      invalidatesTags: (_result, _error, { id }) => [
        "Applications",
        "Dashboard",
        { type: "Application", id },
      ],
    }),
    deleteApplication: build.mutation<void, string>({
      query: (id) => ({ url: `/applications/${id}`, method: "DELETE" }),
      transformResponse: (response: ApiEnvelope<Record<string, never>>) => {
        unwrap(response);
      },
      invalidatesTags: [
        "Applications",
        "Dashboard",
        "Application",
        "Notes",
        "Interviews",
        "StatusHistory",
      ],
    }),
    archiveApplication: build.mutation<void, { id: string; archived: boolean }>({
      query: ({ id, archived }) => ({
        url: `/applications/${id}/${archived ? "archive" : "unarchive"}`,
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<Record<string, never>>) => {
        unwrap(response);
      },
      invalidatesTags: (_result, _error, { id }) => [
        "Applications",
        "Dashboard",
        { type: "Application", id },
      ],
    }),
    changeApplicationStatus: build.mutation<
      Pick<Application, "id" | "status">,
      { id: string; body: ChangeApplicationStatusInput }
    >({
      query: ({ id, body }) => ({ url: `/applications/${id}/status`, method: "POST", body }),
      transformResponse: unwrap,
      invalidatesTags: (_result, _error, { id }) => [
        "Applications",
        "Dashboard",
        "StatusHistory",
        { type: "Application", id },
      ],
    }),
    applicationHistory: build.query<StatusHistoryEntry[], string>({
      query: (id) => `/applications/${id}/history`,
      transformResponse: unwrap,
      providesTags: (_result, _error, id) => [{ type: "StatusHistory", id }],
    }),
  }),
});

export const {
  useApplicationsQuery,
  useApplicationQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
  useArchiveApplicationMutation,
  useChangeApplicationStatusMutation,
  useApplicationHistoryQuery,
} = applicationsApi;
