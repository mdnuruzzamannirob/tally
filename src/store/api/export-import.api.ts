import { baseApi } from "./base-api";
import type { ApiEnvelope } from "@/types/api.types";
import type { ExportBackup } from "@/types/export-import.types";
export const exportImportApi = baseApi.injectEndpoints({ endpoints: (build) => ({
  exportJson: build.mutation<{ blob: Blob; filename: string }, void>({ query: () => ({ url: "/export/json", responseHandler: async (response) => ({ blob: await response.blob(), filename: response.headers.get("content-disposition")?.match(/filename="?([^";]+)"?/i)?.[1] ?? "tally-backup.json" }) }) }),
  exportCsv: build.mutation<{ blob: Blob; filename: string }, void>({ query: () => ({ url: "/export/csv", responseHandler: async (response) => ({ blob: await response.blob(), filename: response.headers.get("content-disposition")?.match(/filename="?([^";]+)"?/i)?.[1] ?? "tally-applications.csv" }) }) }),
  importJson: build.mutation<Record<string, never>, ExportBackup>({ query: (body) => ({ url: "/import/json", method: "POST", body }), transformResponse: (response: ApiEnvelope<Record<string, never>>) => { if (!response.success) throw new Error(response.message); return response.data; }, invalidatesTags: ["Auth", "User", "Applications", "Application", "Tags", "Notes", "Interviews", "Dashboard", "StatusHistory"] }),
}) });
export const { useExportJsonMutation, useExportCsvMutation, useImportJsonMutation } = exportImportApi;
