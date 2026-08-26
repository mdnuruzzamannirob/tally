"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import {
  AppBadge,
  AppButton,
  AppConfirmDialog,
  AppEmptyState,
  AppField,
  AppInput,
  AppModal,
  AppPageHeader,
  AppSelect,
  AppSkeleton,
  AppTabs,
  toast,
} from "@/components/app-ui";
import { useApplicationsQuery } from "@/store/api/applications.api";
import {
  useCreateInterviewMutation,
  useDeleteInterviewMutation,
  useInterviewsQuery,
  useUpdateInterviewMutation,
} from "@/store/api/interviews.api";
import type { Interview, InterviewStatus, InterviewType } from "@/types/interview.types";

const types: InterviewType[] = ["PHONE", "TECHNICAL", "HR", "SYSTEM_DESIGN", "ONSITE", "OTHER"];
const statuses: InterviewStatus[] = ["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"];
const humanize = (value: string) =>
  value
    .split("_")
    .map((part) => part[0] + part.slice(1).toLowerCase())
    .join(" ");
const formatInterviewDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const formatInterviewTime = (value: string) =>
  new Date(value).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
const badgeStatus = (status: InterviewStatus) =>
  status === "COMPLETED"
    ? "success"
    : status === "CANCELLED" || status === "NO_SHOW"
      ? "danger"
      : "info";
const relativeTime = (value: string) => {
  const days = Math.round((new Date(value).getTime() - Date.now()) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  if (days > 1) return `in ${days} days`;
  return `${Math.abs(days)} days ago`;
};

function InterviewList({
  range,
  onEdit,
  onDelete,
}: {
  range: "all" | "upcoming" | "past";
  onEdit: (item: Interview) => void;
  onDelete: (item: Interview) => void;
}) {
  const { data, isLoading, isError } = useInterviewsQuery({
    ...(range === "all" ? {} : { range }),
    page: 1,
    pageSize: 100,
  });
  if (isLoading) return <AppSkeleton className="h-48 w-full" />;
  if (isError)
    return (
      <p className="p-4 text-sm text-destructive" role="alert">
        Interviews could not be loaded.
      </p>
    );
  if (!data?.items.length)
    return (
      <AppEmptyState
        description={
          range === "upcoming"
            ? "Schedule interviews from an application."
            : range === "past"
              ? "Completed, cancelled, and no-show interviews will be kept here."
              : "Schedule your first interview from an application."
        }
        icon={<CalendarDays />}
        title={
          range === "upcoming"
            ? "No interviews scheduled"
            : range === "past"
              ? "No past interviews"
              : "No interviews yet"
        }
      />
    );
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {data.items.map((item) => (
        <article
          aria-label={(item.application?.company ?? "Application") + " interview"}
          className={`flex min-h-[224px] flex-col rounded-[10px] border border-border bg-card p-[18px] ${item.status === "COMPLETED" ? "opacity-60" : ""}`}
          key={item.id}
        >
          <div className="relative min-w-0">
            <div className="min-w-0">
              <Link
                className="min-w-0 w-full"
                href={"/applications/" + (item.application?.id ?? item.applicationId)}
              >
                <p className="pr-24 font-semibold leading-5 tracking-tight">
                  {item.application?.company ?? "Application"} · {item.application?.role ?? ""}
                </p>
                <div className="mt-4 flex flex-col gap-2 text-[13px]">
                  <div className="order-2 flex min-w-0 items-center gap-2 text-[13px] text-muted-foreground">
                    {item.type === "PHONE" ? (
                      <Phone className="size-3.5 shrink-0" />
                    ) : item.type === "ONSITE" ? (
                      <MapPin className="size-3.5 shrink-0" />
                    ) : (
                      <Video className="size-3.5 shrink-0" />
                    )}
                    <p className="truncate font-medium text-foreground/85">
                      {humanize(item.type)}
                      {item.interviewerName ? " · with " + item.interviewerName : ""}
                    </p>
                  </div>
                  <div className="order-1 flex min-w-0 items-baseline justify-between gap-3 text-[13px]">
                    <p className="flex items-center gap-1.5 font-semibold text-foreground">
                      <CalendarDays className="size-3.5 text-muted-foreground" />
                      {formatInterviewDate(item.scheduledAt)}
                      <span className="ml-1 flex items-center gap-1 font-normal text-muted-foreground">
                        <Clock3 className="size-3.5" />
                        {formatInterviewTime(item.scheduledAt)}
                      </span>
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {relativeTime(item.scheduledAt)}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            <AppBadge
              className="absolute top-0 right-0 uppercase tracking-wide"
              size="sm"
              status={badgeStatus(item.status)}
            >
              {humanize(item.status)}
            </AppBadge>
          </div>
          {item.location || item.meetingLink ? (
            <div className="mt-3 flex items-center gap-2 pb-4 text-[13px] text-muted-foreground">
              <MapPin className="size-3.5" />
              <span className="truncate text-muted-foreground">{item.location ?? "Online"}</span>
            </div>
          ) : null}
          <div className="mt-auto flex items-center justify-end gap-1.5 border-t border-border pt-3">
            {item.meetingLink ? (
              <a
                aria-label="Open meeting link"
                title="Open meeting link"
                className="mr-auto inline-flex items-center gap-1 text-[13px] text-primary hover:underline"
                href={item.meetingLink}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink className="size-3.5" /> Open link
              </a>
            ) : null}
            <AppButton
              aria-label="Edit interview"
              className="text-muted-foreground hover:text-foreground"
              title="Edit interview"
              onClick={() => onEdit(item)}
              size="icon"
              tone="ghost"
            >
              <Pencil />
            </AppButton>
            <AppButton
              aria-label="Delete interview"
              className="text-muted-foreground hover:text-danger"
              title="Delete interview"
              onClick={() => onDelete(item)}
              size="icon"
              tone="ghost"
            >
              <Trash2 />
            </AppButton>
          </div>
        </article>
      ))}
    </div>
  );
}

export function InterviewsScreen() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Interview | null>(null);
  const [deleting, setDeleting] = useState<Interview | null>(null);
  const [applicationId, setApplicationId] = useState("");
  const [type, setType] = useState<InterviewType>("PHONE");
  const [scheduledAt, setScheduledAt] = useState("");
  const [interviewerName, setInterviewerName] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<InterviewStatus>("SCHEDULED");
  const { data: applications } = useApplicationsQuery({
    page: 1,
    pageSize: 100,
    includeArchived: false,
  });
  const { data: upcoming } = useInterviewsQuery({ range: "upcoming", page: 1, pageSize: 100 });
  const { data: past } = useInterviewsQuery({ range: "past", page: 1, pageSize: 100 });
  const { data: all } = useInterviewsQuery({ page: 1, pageSize: 100 });
  const [create, createState] = useCreateInterviewMutation();
  const [update, updateState] = useUpdateInterviewMutation();
  const [remove] = useDeleteInterviewMutation();
  const reset = () => {
    setOpen(false);
    setEditing(null);
    setApplicationId("");
    setType("PHONE");
    setScheduledAt("");
    setInterviewerName("");
    setMeetingLink("");
    setLocation("");
    setStatus("SCHEDULED");
  };
  const edit = (item: Interview) => {
    setEditing(item);
    setApplicationId(item.applicationId);
    setType(item.type);
    setScheduledAt(item.scheduledAt.slice(0, 16));
    setInterviewerName(item.interviewerName ?? "");
    setMeetingLink(item.meetingLink ?? "");
    setLocation(item.location ?? "");
    setStatus(item.status);
    setOpen(true);
  };
  const save = async () => {
    if (!applicationId || !scheduledAt) return;
    const body = {
      type,
      scheduledAt: new Date(scheduledAt).toISOString(),
      interviewerName: interviewerName.trim() || undefined,
      meetingLink: meetingLink.trim() || undefined,
      location: location.trim() || undefined,
      status,
    };
    try {
      if (editing) await update({ id: editing.id, applicationId, body }).unwrap();
      else await create({ applicationId, body }).unwrap();
      toast.success(editing ? "Interview updated." : "Interview scheduled.");
      reset();
    } catch {
      toast.error("Could not save interview.");
    }
  };
  return (
    <section className="space-y-6">
      <AppPageHeader
        title="Interviews"
        description="Manage your interview schedule across all applications."
        actions={
          <AppButton onClick={() => setOpen(true)}>
            <CalendarDays /> Add interview
          </AppButton>
        }
      />
      <AppTabs
        className="w-full"
        defaultValue="all"
        width="fit"
        items={[
          {
            value: "all",
            label: (
              <>
                All{" "}
                <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                  {all?.items.length ?? 0}
                </span>
              </>
            ),
            content: <InterviewList range="all" onEdit={edit} onDelete={setDeleting} />,
          },
          {
            value: "upcoming",
            label: (
              <>
                Upcoming{" "}
                <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                  {upcoming?.items.length ?? 0}
                </span>
              </>
            ),
            content: <InterviewList range="upcoming" onEdit={edit} onDelete={setDeleting} />,
          },
          {
            value: "past",
            label: (
              <>
                Past{" "}
                <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs">
                  {past?.items.length ?? 0}
                </span>
              </>
            ),
            content: <InterviewList range="past" onEdit={edit} onDelete={setDeleting} />,
          },
        ]}
      />
      <AppModal
        description="Keep the schedule, meeting details, and interview status up to date."
        footer={
          <>
            <AppButton onClick={reset} tone="ghost">
              Cancel
            </AppButton>
            <AppButton
              disabled={!applicationId || !scheduledAt}
              loading={createState.isLoading || updateState.isLoading}
              onClick={() => void save()}
            >
              {editing ? "Save changes" : "Schedule"}
            </AppButton>
          </>
        }
        onOpenChange={(value) => (value ? setOpen(true) : reset())}
        open={open}
        title={editing ? "Edit interview" : "Add interview"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <AppField label="Application" required>
            <AppSelect
              onValueChange={(value) => setApplicationId(value ?? "")}
              options={(applications?.items ?? []).map((item) => ({
                label: item.company + " · " + item.role,
                value: item.id,
              }))}
              placeholder="Choose an application"
              value={applicationId}
            />
          </AppField>
          <AppField label="Interview type" required>
            <AppSelect
              onValueChange={(value) => setType((value ?? "PHONE") as InterviewType)}
              options={types.map((value) => ({ label: humanize(value), value }))}
              value={type}
            />
          </AppField>
          <AppField label="Status">
            <AppSelect
              onValueChange={(value) => setStatus((value ?? "SCHEDULED") as InterviewStatus)}
              options={statuses.map((value) => ({ label: humanize(value), value }))}
              value={status}
            />
          </AppField>
          <AppField label="Scheduled at" required>
            <AppInput
              onChange={(event) => setScheduledAt(event.target.value)}
              type="datetime-local"
              value={scheduledAt}
            />
          </AppField>
          <AppField label="Interviewer">
            <AppInput
              onChange={(event) => setInterviewerName(event.target.value)}
              value={interviewerName}
            />
          </AppField>
          <AppField label="Meeting link">
            <AppInput
              onChange={(event) => setMeetingLink(event.target.value)}
              value={meetingLink}
            />
          </AppField>
          <AppField label="Location">
            <AppInput onChange={(event) => setLocation(event.target.value)} value={location} />
          </AppField>
        </div>
      </AppModal>
      <AppConfirmDialog
        description="This interview will be permanently deleted."
        onConfirm={() => {
          if (deleting)
            void remove({ id: deleting.id, applicationId: deleting.applicationId })
              .unwrap()
              .then(() => {
                toast.success("Interview deleted.");
                setDeleting(null);
              })
              .catch(() => toast.error("Could not delete interview."));
        }}
        onOpenChange={(value) => !value && setDeleting(null)}
        open={Boolean(deleting)}
        title="Delete interview"
        confirmLabel="Delete"
      />
    </section>
  );
}
