import { baseApi } from "./base-api";
import type { ApiEnvelope } from "@/types/api.types";
import type { CreateTagInput, Tag, UpdateTagInput } from "@/types/tag.types";
const unwrap = <T>(response: ApiEnvelope<T>) => {
  if (!response.success) throw new Error(response.message);
  return response.data;
};
export const tagsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    tags: build.query<Tag[], void>({
      query: () => "/tags",
      transformResponse: unwrap,
      providesTags: ["Tags"],
    }),
    createTag: build.mutation<Tag, CreateTagInput>({
      query: (body) => ({ url: "/tags", method: "POST", body }),
      transformResponse: unwrap,
      invalidatesTags: ["Tags", "Applications"],
    }),
    updateTag: build.mutation<Tag, { id: string; body: UpdateTagInput }>({
      query: ({ id, body }) => ({ url: `/tags/${id}`, method: "PATCH", body }),
      transformResponse: unwrap,
      invalidatesTags: ["Tags", "Applications"],
    }),
    deleteTag: build.mutation<void, string>({
      query: (id) => ({ url: `/tags/${id}`, method: "DELETE" }),
      transformResponse: (response: ApiEnvelope<Record<string, never>>) => {
        unwrap(response);
      },
      invalidatesTags: ["Tags", "Applications"],
    }),
    addApplicationTags: build.mutation<Tag[], { applicationId: string; tagIds: string[] }>({
      query: ({ applicationId, tagIds }) => ({
        url: `/applications/${applicationId}/tags`,
        method: "POST",
        body: { tagIds },
      }),
      transformResponse: unwrap,
      invalidatesTags: (_result, _error, { applicationId }) => [
        "Tags",
        "Applications",
        { type: "Application", id: applicationId },
      ],
    }),
    removeApplicationTag: build.mutation<void, { applicationId: string; tagId: string }>({
      query: ({ applicationId, tagId }) => ({
        url: `/applications/${applicationId}/tags/${tagId}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiEnvelope<Record<string, never>>) => {
        unwrap(response);
      },
      invalidatesTags: (_result, _error, { applicationId }) => [
        "Tags",
        "Applications",
        { type: "Application", id: applicationId },
      ],
    }),
  }),
});
export const {
  useTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useAddApplicationTagsMutation,
  useRemoveApplicationTagMutation,
} = tagsApi;
