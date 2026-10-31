"use client";

import {
  Bell,
  CalendarDays,
  CheckCheck,
  LoaderCircle,
  ShieldCheck,
  BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { AppButton, toast } from "@/components/app-ui";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getErrorMessage } from "@/lib/api-error";
import { useNotificationsQuery, useReadNotificationMutation } from "@/store/api/notifications.api";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

function NotificationIcon({ title }: { title: string }) {
  const text = title.toLowerCase();
  const Icon = /password|account|security/.test(text)
    ? ShieldCheck
    : /interview/.test(text)
      ? CalendarDays
      : /application|follow.up/.test(text)
        ? BriefcaseBusiness
        : Bell;
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
      <Icon aria-hidden="true" className="size-4" />
    </span>
  );
}

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
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen && user) void refetch();
      }}
    >
      <PopoverTrigger
        render={
          <AppButton
            aria-label={`Notifications${data?.unread ? `, ${data.unread} unread` : ""}`}
            size="icon-sm"
            tone="ghost"
            className="relative"
          />
        }
      >
        <Bell className="size-4" />
        {Boolean(data?.unread) && (
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary ring-2 ring-background" />
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(380px,calc(100vw-24px))] gap-0 overflow-hidden rounded-md border border-border bg-popover p-0 shadow-popover ring-0"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3.5">
          <div className="flex items-baseline gap-2">
            <PopoverTitle className="text-sm font-semibold tracking-tight">
              Notifications
            </PopoverTitle>
            {Boolean(data?.unread) && (
              <span className="rounded-sm bg-primary-soft px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-primary">
                {data!.unread} new
              </span>
            )}
          </div>
          {Boolean(data?.unread) && !error && (
            <button
              type="button"
              disabled={saving}
              onClick={() => void read()}
              aria-label="Mark all as read"
              title="Mark all as read"
              className="inline-flex items-center gap-1.5 rounded-sm text-[11px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <CheckCheck className="size-3.5" />
              )}
              Mark all read
            </button>
          )}
        </div>
        <PopoverDescription className="sr-only">
          Reminders, activity and account security.
        </PopoverDescription>
        <div className="max-h-[min(440px,65vh)] overflow-y-auto overscroll-contain">
          {isLoading ? (
            <p
              role="status"
              className="flex items-center gap-2 px-4 py-10 text-xs text-muted-foreground"
            >
              <LoaderCircle className="size-3.5 animate-spin" />
              Loading notifications…
            </p>
          ) : error ? (
            <div role="alert" className="space-y-3 px-4 py-6 text-sm">
              <p>{getErrorMessage(error, "Could not load notifications.")}</p>
              <AppButton tone="outline" size="sm" onClick={() => void refetch()}>
                Try again
              </AppButton>
            </div>
          ) : !data?.items.length ? (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Bell aria-hidden="true" className="size-5" />
              </span>
              <p className="text-sm font-medium">No new notifications</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Interview reminders and account updates will appear here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {data.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href.startsWith("/applications/") ? item.href : "/settings"}
                    className="group relative flex items-start gap-3 px-4 py-4 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                    onClick={() => {
                      if (!item.readAt) void read(item.id);
                      setOpen(false);
                    }}
                  >
                    <NotificationIcon title={item.title} />
                    <div className="min-w-0 flex-1 pr-3">
                      <p
                        className={cn(
                          "text-[13px] leading-5",
                          item.readAt
                            ? "font-normal text-muted-foreground"
                            : "font-medium text-foreground",
                        )}
                      >
                        {!item.readAt && <span className="sr-only">Unread: </span>}
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-[1.7] text-muted-foreground">
                        {item.body}
                      </p>
                      <time
                        className="mt-2 block text-[11px] text-muted-foreground/75"
                        dateTime={item.createdAt}
                        title={new Date(item.createdAt).toLocaleString()}
                      >
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </time>
                    </div>
                    {!item.readAt && (
                      <span
                        aria-hidden="true"
                        className="absolute right-4 top-5 size-2 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link
          href="/settings"
          onClick={() => setOpen(false)}
          className="border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        >
          Notification preferences{" "}
          <span aria-hidden="true" className="ml-1">
            ↗
          </span>
        </Link>
      </PopoverContent>
    </Popover>
  );
}
