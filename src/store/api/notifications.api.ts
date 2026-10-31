import { baseApi } from "./base-api";
import type { ApiEnvelope } from "@/types/api.types";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  href: string;
  readAt: string | null;
  createdAt: string;
}
export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    notifications: build.query<{ items: NotificationItem[]; unread: number }, void>({
      query: () => "/notifications",
      transformResponse: (response: ApiEnvelope<{ items: NotificationItem[]; unread: number }>) => {
        if (!response.success) throw new Error("Unable to load notifications.");
        return response.data;
      },
      providesTags: ["Notifications"],
    }),
    readNotification: build.mutation<unknown, string | undefined>({
      query: (id) => ({
        url: id ? `/notifications/${encodeURIComponent(id)}/read` : "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});
export const { useNotificationsQuery, useReadNotificationMutation } = notificationsApi;
