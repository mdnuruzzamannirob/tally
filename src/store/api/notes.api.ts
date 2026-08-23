import { baseApi } from "./base-api";
import type { ApiEnvelope } from "@/types/api.types";
import type { CreateNoteInput, Note } from "@/types/note.types";
const unwrap = <T,>(response: ApiEnvelope<T>) => { if (!response.success) throw new Error(response.message); return response.data; };
export const notesApi = baseApi.injectEndpoints({ endpoints: (build) => ({
  applicationNotes: build.query<Note[], string>({ query: (id) => `/applications/${id}/notes`, transformResponse: unwrap, providesTags: (_r, _e, id) => [{ type: "Notes", id }] }),
  createNote: build.mutation<Note, { applicationId: string; body: CreateNoteInput }>({ query: ({ applicationId, body }) => ({ url: `/applications/${applicationId}/notes`, method: "POST", body }), transformResponse: unwrap, invalidatesTags: (_r, _e, { applicationId }) => ["Applications", { type: "Notes", id: applicationId }, { type: "Application", id: applicationId }] }),
  updateNote: build.mutation<Note, { id: string; applicationId: string; body: CreateNoteInput }>({ query: ({ id, body }) => ({ url: `/notes/${id}`, method: "PATCH", body }), transformResponse: unwrap, invalidatesTags: (_r, _e, { applicationId }) => ["Applications", { type: "Notes", id: applicationId }, { type: "Application", id: applicationId }] }),
  deleteNote: build.mutation<void, { id: string; applicationId: string }>({ query: ({ id }) => ({ url: `/notes/${id}`, method: "DELETE" }), transformResponse: (response: ApiEnvelope<Record<string, never>>) => { unwrap(response); }, invalidatesTags: (_r, _e, { applicationId }) => ["Applications", { type: "Notes", id: applicationId }, { type: "Application", id: applicationId }] }),
}) });
export const { useApplicationNotesQuery, useCreateNoteMutation, useUpdateNoteMutation, useDeleteNoteMutation } = notesApi;
