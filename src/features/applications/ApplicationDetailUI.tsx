"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CalendarClock,
  ExternalLink,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import {
  AppBadge,
  AppButton,
  AppCard,
  AppConfirmDialog,
  AppDropdownMenu,
  AppEmptyState,
  AppField,
  AppInput,
  AppModal,
  AppSelect,
  AppSkeleton,
  AppTextarea,
  toast,
} from "@/components/app-ui";
import {
  useApplicationHistoryQuery,
  useApplicationQuery,
  useArchiveApplicationMutation,
  useChangeApplicationStatusMutation,
  useDeleteApplicationMutation,
  useUpdateApplicationMutation,
} from "@/store/api/applications.api";
import {
  useApplicationInterviewsQuery,
  useCreateInterviewMutation,
  useDeleteInterviewMutation,
  useUpdateInterviewMutation,
} from "@/store/api/interviews.api";
import {
  useApplicationNotesQuery,
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
} from "@/store/api/notes.api";
import { useTagsQuery } from "@/store/api/tags.api";
import type { ApplicationStatus, EmploymentType, RemoteType } from "@/types/application.types";
import type { InterviewType } from "@/types/interview.types";
import {
  applicationLabels,
  applicationStatuses,
  employmentTypes,
  humanizeApplicationValue as humanize,
  remoteTypes,
} from "./application-config";
import { ApplicationStatusBadge } from "./components/ApplicationStatusBadge";

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateTime = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const relativeTime = (value: string) => {
  const diffMinutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.round(diffDays / 7)}w ago`;
};

const interviewTypeLabels: Record<InterviewType, string> = {
  PHONE: "Phone Screen",
  TECHNICAL: "Technical",
  HR: "Behavioral / HR",
  SYSTEM_DESIGN: "System Design",
  ONSITE: "Onsite",
  OTHER: "Other",
};

export function ApplicationDetailUI({ id }: { id: string }) {
  const router = useRouter();
  const { data: application, isLoading, isError, refetch } = useApplicationQuery(id);
  const { data: notes = [] } = useApplicationNotesQuery(id, { skip: !application });
  const { data: interviewsData } = useApplicationInterviewsQuery(
    { applicationId: id, query: { page: 1, pageSize: 100 } },
    { skip: !application },
  );
  const { data: history = [] } = useApplicationHistoryQuery(id, { skip: !application });
  const { data: tags = [] } = useTagsQuery();

  const [archive] = useArchiveApplicationMutation();
  const [remove] = useDeleteApplicationMutation();
  const [changeStatus, changeStatusState] = useChangeApplicationStatusMutation();
  const [updateApplication, updateAppState] = useUpdateApplicationMutation();

  const [createNote, createNoteState] = useCreateNoteMutation();
  const [updateNote, updateNoteState] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const [createInterview, createIvState] = useCreateInterviewMutation();
  const [updateInterview, updateIvState] = useUpdateInterviewMutation();
  const [deleteInterview] = useDeleteInterviewMutation();

  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const triggerStatusModal = searchParams?.get("statusModal") === "true";

  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "interviews" | "activity">("overview");

  // Status Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(triggerStatusModal);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>("WISHLIST");
  const [statusNote, setStatusNote] = useState("");

  // Edit App Modal State
  const [editAppOpen, setEditAppOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [appliedAt, setAppliedAt] = useState("");
  const [nextFollowUpAt, setNextFollowUpAt] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [remoteType, setRemoteType] = useState<RemoteType | "">("");
  const [employmentType, setEmploymentType] = useState<EmploymentType | "">("");

  // Delete App State
  const [confirmDeleteApp, setConfirmDeleteApp] = useState(false);

  // Note State
  const [noteInput, setNoteInput] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [deleteNoteTarget, setDeleteNoteTarget] = useState<string | null>(null);

  // Interview Modal State
  const [ivModalOpen, setIvModalOpen] = useState(false);
  const [editingIvId, setEditingIvId] = useState<string | null>(null);
  const [ivType, setIvType] = useState<InterviewType>("PHONE");
  const [ivScheduledAt, setIvScheduledAt] = useState("");
  const [ivInterviewer, setIvInterviewer] = useState("");
  const [ivMeetingLink, setIvMeetingLink] = useState("");
  const [ivLocation, setIvLocation] = useState("");
  const [ivNotes, setIvNotes] = useState("");
  const [deleteIvTarget, setDeleteIvTarget] = useState<string | null>(null);

  if (isLoading)
    return (
      <div className="space-y-4">
        <AppSkeleton className="h-8 w-48" />
        <AppSkeleton className="h-64 w-full" />
      </div>
    );

  if (isError || !application)
    return (
      <AppCard>
        <AppEmptyState
          action={
            <Link className="text-sm font-medium text-primary hover:underline" href="/applications">
              Back to applications
            </Link>
          }
          description="The application may have been deleted or you may not have access to it."
          icon={<Archive />}
          title="Application not found"
        />
      </AppCard>
    );

  const interviews = interviewsData?.items ?? [];

  // Open Edit App Modal
  const openEditAppModal = () => {
    setCompany(application.company);
    setRole(application.role);
    setJobUrl(application.jobUrl ?? "");
    setLocation(application.location ?? "");
    setSource(application.source ?? "");
    setAppliedAt(application.appliedAt ? application.appliedAt.slice(0, 10) : "");
    setNextFollowUpAt(
      application.nextFollowUpAt
        ? new Date(application.nextFollowUpAt).toISOString().slice(0, 16)
        : "",
    );
    setSalaryMin(
      application.salaryMin !== null && application.salaryMin !== undefined
        ? String(application.salaryMin)
        : "",
    );
    setSalaryMax(
      application.salaryMax !== null && application.salaryMax !== undefined
        ? String(application.salaryMax)
        : "",
    );
    setCurrency(application.currency ?? "USD");
    setRemoteType(application.remoteType ?? "");
    setEmploymentType(application.employmentType ?? "");
    setEditAppOpen(true);
  };

  const handleSaveApp = async () => {
    if (!company.trim() || !role.trim()) return;
    const min = salaryMin ? Number(salaryMin) : null;
    const max = salaryMax ? Number(salaryMax) : null;
    if ((min !== null || max !== null) && !currency) {
      toast.error("Currency is required with salary.");
      return;
    }
    if (min !== null && max !== null && max < min) {
      toast.error("Salary maximum cannot be below minimum.");
      return;
    }
    try {
      await updateApplication({
        id,
        body: {
          company: company.trim(),
          role: role.trim(),
          jobUrl: jobUrl.trim() || null,
          location: location.trim() || null,
          source: source.trim() || null,
          remoteType: remoteType || null,
          employmentType: employmentType || null,
          appliedAt: appliedAt || null,
          salaryMin: min,
          salaryMax: max,
          currency: min !== null || max !== null ? currency.toUpperCase() : null,
          nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt).toISOString() : null,
        },
      }).unwrap();
      setEditAppOpen(false);
      toast.success("Application updated.");
    } catch {
      toast.error("Could not update application.");
    }
  };

  // Open Status Modal
  const openStatusModal = () => {
    setSelectedStatus(application.status);
    setStatusNote("");
    setStatusModalOpen(true);
  };

  const handleSaveStatus = async () => {
    if (selectedStatus === application.status) {
      setStatusModalOpen(false);
      return;
    }
    try {
      await changeStatus({
        id,
        body: {
          toStatus: selectedStatus,
          note: statusNote.trim() || undefined,
        },
      }).unwrap();
      setStatusModalOpen(false);
      await refetch();
      toast.success(`Status updated to ${applicationLabels[selectedStatus]}.`);
    } catch {
      toast.error("Could not update status.");
    }
  };

  // Notes Actions
  const handleSaveNote = async () => {
    const content = noteInput.trim();
    if (!content) {
      toast.error("Note content is required.");
      return;
    }
    try {
      if (editingNoteId) {
        await updateNote({
          applicationId: id,
          id: editingNoteId,
          body: { content },
        }).unwrap();
        toast.success("Note updated.");
        setEditingNoteId(null);
      } else {
        await createNote({
          applicationId: id,
          body: { content },
        }).unwrap();
        toast.success("Note added.");
      }
      setNoteInput("");
    } catch {
      toast.error("Could not save note.");
    }
  };

  const handleEditNote = (noteItem: (typeof notes)[number]) => {
    setEditingNoteId(noteItem.id);
    setNoteInput(noteItem.content);
  };

  const handleConfirmDeleteNote = async () => {
    if (!deleteNoteTarget) return;
    try {
      await deleteNote({ applicationId: id, id: deleteNoteTarget }).unwrap();
      toast.success("Note removed.");
      setDeleteNoteTarget(null);
    } catch {
      toast.error("Could not delete note.");
    }
  };

  // Interview Actions
  const openCreateInterview = () => {
    setEditingIvId(null);
    setIvType("PHONE");
    setIvScheduledAt("");
    setIvInterviewer("");
    setIvMeetingLink("");
    setIvLocation("");
    setIvNotes("");
    setIvModalOpen(true);
  };

  const openEditInterview = (iv: (typeof interviews)[number]) => {
    setEditingIvId(iv.id);
    setIvType(iv.type);
    setIvScheduledAt(
      iv.scheduledAt ? new Date(iv.scheduledAt).toISOString().slice(0, 16) : "",
    );
    setIvInterviewer(iv.interviewerName ?? "");
    setIvMeetingLink(iv.meetingLink ?? "");
    setIvLocation(iv.location ?? "");
    setIvNotes(iv.notes ?? "");
    setIvModalOpen(true);
  };

  const handleSaveInterview = async () => {
    if (!ivScheduledAt) {
      toast.error("Interview date and time is required.");
      return;
    }
    try {
      if (editingIvId) {
        await updateInterview({
          applicationId: id,
          id: editingIvId,
          body: {
            type: ivType,
            scheduledAt: new Date(ivScheduledAt).toISOString(),
            interviewerName: ivInterviewer.trim() || undefined,
            meetingLink: ivMeetingLink.trim() || undefined,
            location: ivLocation.trim() || undefined,
            notes: ivNotes.trim() || undefined,
          },
        }).unwrap();
        toast.success("Interview updated.");
      } else {
        await createInterview({
          applicationId: id,
          body: {
            type: ivType,
            scheduledAt: new Date(ivScheduledAt).toISOString(),
            interviewerName: ivInterviewer.trim() || undefined,
            meetingLink: ivMeetingLink.trim() || undefined,
            location: ivLocation.trim() || undefined,
            notes: ivNotes.trim() || undefined,
          },
        }).unwrap();
        toast.success("Interview scheduled.");
      }
      setIvModalOpen(false);
    } catch {
      toast.error("Could not save interview.");
    }
  };

  const handleConfirmDeleteInterview = async () => {
    if (!deleteIvTarget) return;
    try {
      await deleteInterview({ applicationId: id, id: deleteIvTarget }).unwrap();
      toast.success("Interview removed.");
      setDeleteIvTarget(null);
    } catch {
      toast.error("Could not delete interview.");
    }
  };

  const fuDate = application.nextFollowUpAt ? new Date(application.nextFollowUpAt) : null;
  const isFuOverdue = fuDate ? fuDate < new Date() : false;
  const isFuToday = fuDate ? fuDate.toDateString() === new Date().toDateString() : false;

  return (
    <section className="space-y-4">
      {/* Back Link */}
      <Link
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        href="/applications"
      >
        <ArrowLeft className="size-3.5" /> Back to applications
      </Link>

      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{application.company}</h1>
            <ApplicationStatusBadge status={application.status} />
            {application.archivedAt && (
              <AppBadge size="sm" status="neutral">
                Archived
              </AppBadge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {application.role} · Updated {relativeTime(application.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AppButton onClick={openStatusModal} size="sm" tone="secondary">
            Change status
          </AppButton>
          <AppButton onClick={openEditAppModal} size="sm" tone="secondary">
            <Pencil className="size-3.5" /> Edit
          </AppButton>
          <AppDropdownMenu
            items={[
              {
                label: application.archivedAt ? "Unarchive" : "Archive",
                icon: <Archive className="size-3.5" />,
                onSelect: () =>
                  void archive({ id, archived: !application.archivedAt })
                    .unwrap()
                    .then(() =>
                      toast.success(
                        application.archivedAt
                          ? "Application unarchived."
                          : "Application archived.",
                      ),
                    ),
              },
              {
                label: "Delete",
                icon: <Trash2 className="size-3.5" />,
                variant: "destructive",
                separatorBefore: true,
                onSelect: () => setConfirmDeleteApp(true),
              },
            ]}
            trigger={
              <button
                aria-label="More actions"
                className="rounded-md border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                type="button"
              >
                <MoreHorizontal className="size-4" />
              </button>
            }
          />
        </div>
      </div>

      {/* Metadata Grid Card */}
      <AppCard className="overflow-hidden p-4 shadow-xs">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Location
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <MapPin className="size-3.5 text-muted-foreground" />
              <span>{application.location || "—"}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Remote Type
            </span>
            <div className="text-xs font-medium">
              {application.remoteType ? humanize(application.remoteType) : "—"}
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Employment
            </span>
            <div className="text-xs font-medium">
              {application.employmentType ? humanize(application.employmentType) : "—"}
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Source
            </span>
            <div className="text-xs font-medium">{application.source || "—"}</div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Applied Date
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Calendar className="size-3.5 text-muted-foreground" />
              <span>{formatDate(application.appliedAt)}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Follow-up
            </span>
            <div className="text-xs font-medium">
              {fuDate ? (
                <span
                  className={`inline-flex items-center gap-1 ${
                    isFuOverdue ? "text-danger" : isFuToday ? "text-warning" : "text-muted-foreground"
                  }`}
                >
                  {isFuOverdue ? (
                    <AlertTriangle className="size-3.5" />
                  ) : (
                    <CalendarClock className="size-3.5" />
                  )}
                  {isFuOverdue
                    ? `Overdue · ${formatDateTime(application.nextFollowUpAt)}`
                    : isFuToday
                      ? `Today, ${fuDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`
                      : formatDateTime(application.nextFollowUpAt)}
                </span>
              ) : (
                "—"
              )}
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Salary Range
            </span>
            <div className="text-xs font-medium">
              {application.salaryMin !== null && application.salaryMin !== undefined
                ? `${Number(application.salaryMin).toLocaleString()}${
                    application.salaryMax !== null && application.salaryMax !== undefined
                      ? ` – ${Number(application.salaryMax).toLocaleString()}`
                      : ""
                  } ${application.currency || ""}`
                : "—"}
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Job Link
            </span>
            <div className="text-xs font-medium">
              {application.jobUrl ? (
                <a
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                  href={application.jobUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Open posting <ExternalLink className="size-3" />
                </a>
              ) : (
                "—"
              )}
            </div>
          </div>
        </div>
      </AppCard>

      {/* Tabs Container */}
      <AppCard className="overflow-hidden" padding="none">
        <div className="border-b border-border px-4">
          <div className="flex gap-4">
            <button
              className={`border-b-2 py-3 text-xs font-semibold transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("overview")}
              type="button"
            >
              Overview
            </button>
            <button
              className={`flex items-center gap-1.5 border-b-2 py-3 text-xs font-semibold transition-colors ${
                activeTab === "notes"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("notes")}
              type="button"
            >
              Notes
              <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground font-semibold">
                {notes.length}
              </span>
            </button>
            <button
              className={`flex items-center gap-1.5 border-b-2 py-3 text-xs font-semibold transition-colors ${
                activeTab === "interviews"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("interviews")}
              type="button"
            >
              Interviews
              <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground font-semibold">
                {interviews.length}
              </span>
            </button>
            <button
              className={`border-b-2 py-3 text-xs font-semibold transition-colors ${
                activeTab === "activity"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("activity")}
              type="button"
            >
              Activity
            </button>
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-4 p-5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Tags
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {application.tags.length ? (
                  application.tags.map((tag) => (
                    <span
                      className="inline-flex items-center gap-1.5 rounded border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-foreground"
                      key={tag.id}
                    >
                      <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: tag.color || "var(--primary)" }}
                      />
                      {tag.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No tags assigned.</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Latest Note
              </span>
              <p className="mt-1.5 text-sm">
                {notes.length ? (
                  notes[0].content
                ) : (
                  <span className="text-muted-foreground">No notes recorded yet.</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Notes Tab Content */}
        {activeTab === "notes" && (
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <AppTextarea
                aria-label="Note content"
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add a note… (1–5000 characters)"
                rows={3}
                value={noteInput}
              />
              <div className="flex justify-end gap-2">
                {editingNoteId && (
                  <AppButton
                    onClick={() => {
                      setEditingNoteId(null);
                      setNoteInput("");
                    }}
                    size="sm"
                    tone="ghost"
                  >
                    Cancel
                  </AppButton>
                )}
                <AppButton
                  disabled={!noteInput.trim()}
                  loading={createNoteState.isLoading || updateNoteState.isLoading}
                  onClick={() => void handleSaveNote()}
                  size="sm"
                >
                  {editingNoteId ? "Save note" : "Add note"}
                </AppButton>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {notes.length ? (
                notes.map((n) => (
                  <div
                    className="rounded-lg border border-border bg-card p-3.5 shadow-2xs"
                    key={n.id}
                  >
                    <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDateTime(n.createdAt)}
                        {n.updatedAt ? " · edited" : ""}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          aria-label="Edit note"
                          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          onClick={() => handleEditNote(n)}
                          type="button"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          aria-label="Delete note"
                          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteNoteTarget(n.id)}
                          type="button"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{n.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No notes yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Interviews Tab Content */}
        {activeTab === "interviews" && (
          <div className="space-y-4 p-5">
            <div className="flex justify-end">
              <AppButton onClick={openCreateInterview} size="sm">
                <Plus className="size-3.5" /> Add interview
              </AppButton>
            </div>

            <div className="space-y-2.5">
              {interviews.length ? (
                interviews.map((iv) => (
                  <div
                    className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between"
                    key={iv.id}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Video className="size-4.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {interviewTypeLabels[iv.type] ?? iv.type} Interview
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDateTime(iv.scheduledAt)}
                          {iv.interviewerName ? ` · ${iv.interviewerName}` : ""}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AppBadge
                        status={
                          iv.status === "COMPLETED"
                            ? "success"
                            : iv.status === "CANCELLED"
                              ? "danger"
                              : "info"
                        }
                      >
                        {humanize(iv.status)}
                      </AppBadge>
                      {iv.meetingLink && (
                        <a
                          className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted"
                          href={iv.meetingLink}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <Video className="size-3.5" /> Join
                        </a>
                      )}
                      <button
                        aria-label="Edit interview"
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() => openEditInterview(iv)}
                        type="button"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        aria-label="Delete interview"
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setDeleteIvTarget(iv.id)}
                        type="button"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">
                  No interviews scheduled for this application yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Activity Tab Content */}
        {activeTab === "activity" && (
          <div className="space-y-4 p-5">
            {history.length ? (
              <div className="relative space-y-4 border-l border-border pl-4 ml-2">
                {history.map((h) => (
                  <div className="relative space-y-1" key={h.id}>
                    <div className="absolute -left-5.5 top-1 size-3 rounded-full border-2 border-background bg-primary" />
                    <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
                      <ApplicationStatusBadge status={h.fromStatus} />
                      <ArrowRight className="size-3 text-muted-foreground" />
                      <ApplicationStatusBadge status={h.toStatus} />
                    </div>
                    {h.note && (
                      <p className="text-xs italic text-muted-foreground">“{h.note}”</p>
                    )}
                    <div className="text-[11px] text-muted-foreground">
                      {formatDateTime(h.changedAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No status changes recorded yet.</p>
            )}
          </div>
        )}
      </AppCard>

      {/* Change Status Modal */}
      <AppModal
        description="Update application stage and optionally attach a note."
        footer={
          <>
            <AppButton onClick={() => setStatusModalOpen(false)} tone="ghost">
              Cancel
            </AppButton>
            <AppButton
              loading={changeStatusState.isLoading}
              onClick={() => void handleSaveStatus()}
            >
              Update status
            </AppButton>
          </>
        }
        onOpenChange={setStatusModalOpen}
        open={statusModalOpen}
        title="Change application status"
      >
        <div className="space-y-4">
          <AppField label="Status" required>
            <AppSelect
              onValueChange={(val) => setSelectedStatus((val as ApplicationStatus) || "WISHLIST")}
              options={applicationStatuses.map((st) => ({
                label: applicationLabels[st],
                value: st,
              }))}
              value={selectedStatus}
            />
          </AppField>
          <AppField label="Status note (optional)">
            <AppTextarea
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder="e.g. Completed technical round with positive feedback..."
              rows={3}
              value={statusNote}
            />
          </AppField>
        </div>
      </AppModal>

      {/* Edit Application Modal */}
      <AppModal
        bodyClassName="max-h-[75vh]"
        description="Update key details for this opportunity."
        footer={
          <>
            <AppButton onClick={() => setEditAppOpen(false)} tone="ghost">
              Cancel
            </AppButton>
            <AppButton
              disabled={!company.trim() || !role.trim()}
              loading={updateAppState.isLoading}
              onClick={() => void handleSaveApp()}
            >
              Save changes
            </AppButton>
          </>
        }
        onOpenChange={setEditAppOpen}
        open={editAppOpen}
        title="Edit application"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AppField label="Company" required>
              <AppInput onChange={(e) => setCompany(e.target.value)} value={company} />
            </AppField>
            <AppField label="Role" required>
              <AppInput onChange={(e) => setRole(e.target.value)} value={role} />
            </AppField>
            <AppField label="Job URL">
              <AppInput onChange={(e) => setJobUrl(e.target.value)} type="url" value={jobUrl} />
            </AppField>
            <AppField label="Location">
              <AppInput onChange={(e) => setLocation(e.target.value)} value={location} />
            </AppField>
            <AppField label="Workplace">
              <AppSelect
                onValueChange={(v) => setRemoteType(v === "unset" || !v ? "" : (v as RemoteType))}
                options={[
                  { label: "Not set", value: "unset" },
                  ...remoteTypes.map((v) => ({ label: humanize(v), value: v })),
                ]}
                value={remoteType || "unset"}
              />
            </AppField>
            <AppField label="Employment">
              <AppSelect
                onValueChange={(v) =>
                  setEmploymentType(v === "unset" || !v ? "" : (v as EmploymentType))
                }
                options={[
                  { label: "Not set", value: "unset" },
                  ...employmentTypes.map((v) => ({ label: humanize(v), value: v })),
                ]}
                value={employmentType || "unset"}
              />
            </AppField>
            <AppField label="Source">
              <AppInput
                onChange={(e) => setSource(e.target.value)}
                placeholder="LinkedIn, Referral..."
                value={source}
              />
            </AppField>
            <AppField label="Applied date">
              <AppInput onChange={(e) => setAppliedAt(e.target.value)} type="date" value={appliedAt} />
            </AppField>
            <AppField label="Follow-up">
              <AppInput
                onChange={(e) => setNextFollowUpAt(e.target.value)}
                type="datetime-local"
                value={nextFollowUpAt}
              />
            </AppField>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <AppField label="Minimum salary">
              <AppInput
                inputMode="decimal"
                onChange={(e) => setSalaryMin(e.target.value)}
                value={salaryMin}
              />
            </AppField>
            <AppField label="Maximum salary">
              <AppInput
                inputMode="decimal"
                onChange={(e) => setSalaryMax(e.target.value)}
                value={salaryMax}
              />
            </AppField>
            <AppField label="Currency">
              <AppInput
                maxLength={3}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                value={currency}
              />
            </AppField>
          </div>
        </div>
      </AppModal>

      {/* Add/Edit Interview Modal */}
      <AppModal
        description="Record details for an upcoming or completed interview."
        footer={
          <>
            <AppButton onClick={() => setIvModalOpen(false)} tone="ghost">
              Cancel
            </AppButton>
            <AppButton
              disabled={!ivScheduledAt}
              loading={createIvState.isLoading || updateIvState.isLoading}
              onClick={() => void handleSaveInterview()}
            >
              {editingIvId ? "Save changes" : "Schedule interview"}
            </AppButton>
          </>
        }
        onOpenChange={setIvModalOpen}
        open={ivModalOpen}
        title={editingIvId ? "Edit interview" : "Schedule interview"}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AppField label="Interview type" required>
              <AppSelect
                onValueChange={(val) => setIvType((val as InterviewType) || "PHONE")}
                options={Object.entries(interviewTypeLabels).map(([key, lbl]) => ({
                  label: lbl,
                  value: key,
                }))}
                value={ivType}
              />
            </AppField>
            <AppField label="Date & time" required>
              <AppInput
                onChange={(e) => setIvScheduledAt(e.target.value)}
                type="datetime-local"
                value={ivScheduledAt}
              />
            </AppField>
            <AppField label="Interviewer name">
              <AppInput
                onChange={(e) => setIvInterviewer(e.target.value)}
                placeholder="e.g. Sarah Connor"
                value={ivInterviewer}
              />
            </AppField>
            <AppField label="Meeting link">
              <AppInput
                onChange={(e) => setIvMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                type="url"
                value={ivMeetingLink}
              />
            </AppField>
          </div>
          <AppField label="Location (if in-person)">
            <AppInput
              onChange={(e) => setIvLocation(e.target.value)}
              placeholder="e.g. HQ 4th Floor"
              value={ivLocation}
            />
          </AppField>
          <AppField label="Notes / prep">
            <AppTextarea
              onChange={(e) => setIvNotes(e.target.value)}
              placeholder="Topics, questions to ask, research notes..."
              rows={3}
              value={ivNotes}
            />
          </AppField>
        </div>
      </AppModal>

      {/* Delete Application Confirmation */}
      <AppConfirmDialog
        confirmLabel="Delete"
        description="This will permanently delete this application along with all its notes, interviews, and status history. This action cannot be undone."
        onConfirm={() => {
          void remove(id)
            .unwrap()
            .then(() => {
              toast.success("Application deleted.");
              router.replace("/applications");
            })
            .catch(() => toast.error("Could not delete application."));
          setConfirmDeleteApp(false);
        }}
        onOpenChange={setConfirmDeleteApp}
        open={confirmDeleteApp}
        title={`Delete application for ${application.company}?`}
      />

      {/* Delete Note Confirmation */}
      <AppConfirmDialog
        confirmLabel="Delete"
        description="This note will be permanently removed. This cannot be undone."
        onConfirm={() => void handleConfirmDeleteNote()}
        onOpenChange={(open) => {
          if (!open) setDeleteNoteTarget(null);
        }}
        open={Boolean(deleteNoteTarget)}
        title="Delete note?"
      />

      {/* Delete Interview Confirmation */}
      <AppConfirmDialog
        confirmLabel="Delete"
        description="This interview will be permanently removed. This cannot be undone."
        onConfirm={() => void handleConfirmDeleteInterview()}
        onOpenChange={(open) => {
          if (!open) setDeleteIvTarget(null);
        }}
        open={Boolean(deleteIvTarget)}
        title="Delete interview?"
      />
    </section>
  );
}
