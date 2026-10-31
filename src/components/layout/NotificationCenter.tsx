"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AppButton, toast } from "@/components/app-ui";
import { AppModal } from "@/components/app-ui/app-modal";
import { getErrorMessage } from "@/lib/api-error";
import { useNotificationsQuery, useReadNotificationMutation } from "@/store/api/notifications.api";
import { useAppSelector } from "@/store/hooks";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const { data, error, isLoading, refetch } = useNotificationsQuery(undefined, {
    skip: !user,
    pollingInterval: 60_000,
    skipPollingIfUnfocused: true,
  });
  const [markRead, { isLoading: saving }] = useReadNotificationMutation();
  const read = async (id?: string) => {
    try {
      await markRead(id).unwrap();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not mark notifications as read."));
    }
  };
  return (
    <>
      <AppButton
        aria-label={`Notifications${data?.unread ? `, ${data.unread} unread` : ""}`}
        size="icon-sm"
        tone="ghost"
        className="relative"
        onClick={() => {
          setOpen(true);
          if (user) void refetch();
        }}
      >
        <Bell className="size-4" />
        {Boolean(data?.unread) && (
          <span className="absolute right-1 top-1 size-2 rounded-full bg-primary" />
        )}
      </AppButton>
      <AppModal
        open={open}
        onOpenChange={setOpen}
        title="Notifications"
        description="Interview updates, reminders, follow-ups and account security alerts."
      >
        {isLoading ? (
          <p role="status">Loading notifications…</p>
        ) : error ? (
          <div role="alert">
            <p>{getErrorMessage(error, "Could not load notifications.")}</p>
            <AppButton tone="outline" onClick={() => void refetch()}>
              Try again
            </AppButton>
          </div>
        ) : (
          <>
            {Boolean(data?.unread) && (
              <AppButton
                className="mb-3"
                loading={saving}
                tone="outline"
                onClick={() => void read()}
              >
                Mark all as read
              </AppButton>
            )}
            {!data?.items.length ? (
              <p className="text-sm text-muted-foreground">You&apos;re all caught up.</p>
            ) : (
              <ul className="divide-y divide-border">
                {data.items.map((item) => (
                  <li
                    key={item.id}
                    className={`py-3 ${item.readAt ? "text-muted-foreground" : "text-foreground"}`}
                  >
                    <Link
                      href={item.href.startsWith("/applications/") ? item.href : "/settings"}
                      className="block rounded-md focus-visible:outline-2 focus-visible:outline-primary"
                      onClick={() => {
                        if (!item.readAt) void read(item.id);
                        setOpen(false);
                      }}
                    >
                      <p className="text-sm font-semibold">
                        {!item.readAt && <span className="sr-only">Unread: </span>}
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm">{item.body}</p>
                      <time
                        className="mt-1 block text-xs text-muted-foreground"
                        dateTime={item.createdAt}
                      >
                        {new Date(item.createdAt).toLocaleString()}
                      </time>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </AppModal>
    </>
  );
}
