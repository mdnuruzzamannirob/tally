"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";
import { BriefcaseBusiness, CalendarClock, ChevronLeft, ChevronRight, Filter, Kanban, Plus, Search, Table2 } from "lucide-react";
import {
  AppBadge,
  AppButton,
  AppCard,
  AppEmptyState,
  AppField,
  AppInput,
  AppModal,
  AppMultiSelect,
  AppPagination,
  AppPageHeader,
  AppPopover,
  AppSelect,
  AppSegmentedControl,
  AppSkeleton,
  AppTable,
  AppTextarea,
  toast,
} from "@/components/app-ui";
import { useApplicationsQuery, useChangeApplicationStatusMutation, useCreateApplicationMutation } from "@/store/api/applications.api";
import { useTagsQuery } from "@/store/api/tags.api";
import type {
  Application,
  ApplicationStatus,
  EmploymentType,
  RemoteType,
} from "@/types/application.types";

const labels: Record<ApplicationStatus, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};
const tones: Record<ApplicationStatus, "neutral" | "info" | "success" | "warning" | "danger"> = {
  WISHLIST: "neutral",
  APPLIED: "info",
  SCREENING: "warning",
  INTERVIEW: "warning",
  OFFER: "success",
  REJECTED: "danger",
  WITHDRAWN: "neutral",
};
const statuses = Object.keys(labels) as ApplicationStatus[];
const remoteTypes: RemoteType[] = ["ONSITE", "REMOTE", "HYBRID"];
const employmentTypes: EmploymentType[] = ["FULL_TIME", "CONTRACT", "INTERNSHIP"];
const boardAccents: Record<ApplicationStatus, string> = {
  WISHLIST: "bg-slate-400",
  APPLIED: "bg-indigo-500",
  SCREENING: "bg-cyan-500",
  INTERVIEW: "bg-violet-500",
  OFFER: "bg-emerald-500",
  REJECTED: "bg-rose-500",
  WITHDRAWN: "bg-slate-300",
};
const humanize = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
const queryValue = (params: URLSearchParams, key: string) => params.get(key) ?? "";
export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <AppBadge status={tones[status]}>{labels[status]}</AppBadge>;
}

function ApplicationBoard({ rows, onMove }: { rows: Application[]; onMove: (id: string, status: ApplicationStatus) => Promise<boolean> }) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<ApplicationStatus | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ApplicationStatus>>({});
  const boardRef = useRef<HTMLDivElement>(null);
  const boardRows = useMemo(() => rows.map((row) => statusOverrides[row.id] ? { ...row, status: statusOverrides[row.id] } : row), [rows, statusOverrides]);
  const dropApplication = async (id: string, status: ApplicationStatus) => {
    const application = boardRows.find((row) => row.id === id);
    if (!application || application.status === status) return;
    const previousStatus = application.status;
    setStatusOverrides((current) => ({ ...current, [id]: status }));
    if (!await onMove(id, status)) setStatusOverrides((current) => ({ ...current, [id]: previousStatus }));
  };
  const scrollBoard = (direction: -1 | 1) => boardRef.current?.scrollBy({ left: direction * 480, behavior: "smooth" });
  const autoScroll = (event: DragEvent<HTMLDivElement>) => {
    const bounds = boardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    if (event.clientX - bounds.left < 96) boardRef.current?.scrollBy({ left: -28 });
    if (bounds.right - event.clientX < 96) boardRef.current?.scrollBy({ left: 28 });
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Drag an application to update its stage.</p><div className="flex gap-1"><AppButton aria-label="Scroll board left" onClick={() => scrollBoard(-1)} size="icon-sm" tone="outline"><ChevronLeft /></AppButton><AppButton aria-label="Scroll board right" onClick={() => scrollBoard(1)} size="icon-sm" tone="outline"><ChevronRight /></AppButton></div></div>
    <div className="flex gap-3 overflow-x-auto pb-3 [scrollbar-width:thin]" onDragOver={autoScroll} ref={boardRef}>
      {(["WISHLIST", "APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"] as ApplicationStatus[]).map((status) => (
        <div className={`w-52 shrink-0 rounded-xl border bg-muted/30 transition-colors ${dragOverStatus === status ? "border-primary bg-primary/5 shadow-sm" : "border-border"}`} key={status} onDragEnter={() => setDragOverStatus(status)} onDragLeave={() => setDragOverStatus(null)} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }} onDrop={(event) => { event.preventDefault(); const id = event.dataTransfer.getData("application-id") || draggedId; if (id) void dropApplication(id, status); setDraggedId(null); setDragOverStatus(null); }}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold"><span className={`size-2 rounded-full ${boardAccents[status]}`} />{labels[status]}</span>
            <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">{boardRows.filter((row) => row.status === status).length}</span>
          </div>
          <div className="min-h-44 space-y-2 p-2">
            {boardRows.filter((row) => row.status === status).map((row) => (
              <Link className="block cursor-grab rounded-lg border border-border bg-card p-3 shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md active:cursor-grabbing" draggable onDragEnd={() => { setDraggedId(null); setDragOverStatus(null); }} onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("application-id", row.id); setDraggedId(row.id); }} href={`/applications/${row.id}`} key={row.id}>
                <div className="flex items-start justify-between gap-2"><span className="text-sm font-semibold">{row.company}</span><ChevronRight className="size-4 shrink-0 text-muted-foreground" /></div>
                <p className="mt-1 text-sm text-muted-foreground">{row.role}</p>
                <div className="mt-3 flex flex-wrap gap-1.5"><StatusBadge status={row.status} />{row.remoteType ? <AppBadge>{humanize(row.remoteType)}</AppBadge> : null}</div>
                {row.nextFollowUpAt ? <p className="mt-3 text-xs text-warning">Follow-up {new Date(row.nextFollowUpAt).toLocaleDateString()}</p> : null}
              </Link>
            ))}{!boardRows.some((row) => row.status === status) ? <div className={`flex min-h-36 items-center justify-center rounded-lg border border-dashed text-center text-xs text-muted-foreground ${dragOverStatus === status ? "border-primary text-primary" : "border-border/70"}`}>{draggedId ? "Drop application here" : "No applications"}</div> : null}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

export function ApplicationWorkspace() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const read = useCallback((key: string) => queryValue(searchParams, key), [searchParams]);
  const [createOpen, setCreateOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
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
  const [initialNote, setInitialNote] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [remoteType, setRemoteType] = useState<RemoteType | "">("");
  const [employmentType, setEmploymentType] = useState<EmploymentType | "">("");
  const [view, setView] = useState<"table" | "board">("table");
  const [createApplication, createState] = useCreateApplicationMutation();
  const [changeApplicationStatus, changeStatusState] = useChangeApplicationStatusMutation();
  const { data: tags = [] } = useTagsQuery();
  const page = Number(queryValue(searchParams, "page") || "1");
  const pageSize = [10, 20, 50].includes(Number(queryValue(searchParams, "pageSize"))) ? Number(queryValue(searchParams, "pageSize")) : 20;
  const status = (queryValue(searchParams, "status") as ApplicationStatus | "") || "";
  const query = useMemo(
    () => ({
      page,
      pageSize,
      ...(queryValue(searchParams, "search") ? { search: queryValue(searchParams, "search") } : {}),
      ...(status ? { status } : {}),
      ...(queryValue(searchParams, "tag") ? { tag: queryValue(searchParams, "tag") } : {}),
      ...(queryValue(searchParams, "remoteType")
        ? { remoteType: queryValue(searchParams, "remoteType") as RemoteType }
        : {}),
      ...(queryValue(searchParams, "employmentType")
        ? { employmentType: queryValue(searchParams, "employmentType") as EmploymentType }
        : {}),
      ...(queryValue(searchParams, "source") ? { source: queryValue(searchParams, "source") } : {}),
      ...(queryValue(searchParams, "appliedFrom")
        ? { appliedFrom: queryValue(searchParams, "appliedFrom") }
        : {}),
      ...(queryValue(searchParams, "appliedTo")
        ? { appliedTo: queryValue(searchParams, "appliedTo") }
        : {}),
      ...(queryValue(searchParams, "followUp")
        ? {
            followUp: queryValue(searchParams, "followUp") as
              "overdue" | "today" | "upcoming" | "none",
          }
        : {}),
      ...(queryValue(searchParams, "includeArchived") === "true" ? { includeArchived: true } : {}),
      sort: (queryValue(searchParams, "sort") || "updatedAt") as
        "updatedAt" | "createdAt" | "company" | "role" | "appliedAt" | "nextFollowUpAt" | "status",
      order: (queryValue(searchParams, "order") || "desc") as "asc" | "desc",
    }),
    [page, pageSize, searchParams, status],
  );
  const { data, isError, isLoading, isFetching, refetch } = useApplicationsQuery(query);
  const rows = data?.items ?? [];
  const updateUrl = useCallback(
    (changes: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(changes).forEach(([key, value]) => {
        if (!value) next.delete(key);
        else next.set(key, value);
      });
      if (!("page" in changes)) next.set("page", "1");
      router.replace(`${pathname}?${next.toString()}`);
    },
    [pathname, router, searchParams],
  );
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (queryValue(searchParams, "search") !== searchInput.trim())
        updateUrl({ search: searchInput.trim() || undefined });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput, searchParams, updateUrl]);
  const clearFilters = () => {
    setSearchInput("");
    router.replace(pathname);
  };
  const moveApplication = async (id: string, toStatus: ApplicationStatus) => {
    const row = rows.find((item) => item.id === id);
    if (!row || row.status === toStatus || changeStatusState.isLoading) return false;
    try {
      await changeApplicationStatus({ id, body: { toStatus } }).unwrap();
      await refetch();
      toast.success(`${row.company} moved to ${labels[toStatus]}.`);
      return true;
    } catch {
      toast.error("Could not update application status.");
      return false;
    }
  };
  const resetCreate = () => {
    setCompany("");
    setRole("");
    setJobUrl("");
    setLocation("");
    setSource("");
    setAppliedAt("");
    setNextFollowUpAt("");
    setSalaryMin("");
    setSalaryMax("");
    setCurrency("USD");
    setInitialNote("");
    setTagIds([]);
    setRemoteType("");
    setEmploymentType("");
  };
  const submitCreate = async () => {
    if (!company.trim() || !role.trim()) return;
    const min = salaryMin ? Number(salaryMin) : undefined;
    const max = salaryMax ? Number(salaryMax) : undefined;
    if ((min !== undefined || max !== undefined) && !currency) {
      toast.error("Currency is required with salary.");
      return;
    }
    if (min !== undefined && max !== undefined && max < min) {
      toast.error("Salary maximum cannot be below minimum.");
      return;
    }
    try {
      await createApplication({
        company: company.trim(),
        role: role.trim(),
        ...(jobUrl.trim() ? { jobUrl: jobUrl.trim() } : {}),
        ...(location.trim() ? { location: location.trim() } : {}),
        ...(source.trim() ? { source: source.trim() } : {}),
        ...(remoteType ? { remoteType } : {}),
        ...(employmentType ? { employmentType } : {}),
        ...(appliedAt ? { appliedAt } : {}),
        ...(min !== undefined ? { salaryMin: min } : {}),
        ...(max !== undefined ? { salaryMax: max } : {}),
        ...(min !== undefined || max !== undefined ? { currency: currency.toUpperCase() } : {}),
        ...(nextFollowUpAt ? { nextFollowUpAt: new Date(nextFollowUpAt).toISOString() } : {}),
        ...(tagIds.length ? { tagIds } : {}),
        ...(initialNote.trim() ? { initialNote: initialNote.trim() } : {}),
      }).unwrap();
      toast.success("Application added.");
      resetCreate();
      setCreateOpen(false);
    } catch {
      toast.error("Could not add application.");
    }
  };
  const activeFilterCount = ["search", "status", "tag", "remoteType", "employmentType", "source", "appliedFrom", "appliedTo", "followUp", "includeArchived"].filter((key) => Boolean(read(key))).length;
  const hasFilters = activeFilterCount > 0;
  if (isLoading)
    return (
      <div className="space-y-3">
        <AppSkeleton className="h-11 w-full" />
        <AppSkeleton className="h-80 w-full" />
      </div>
    );
  if (isError)
    return (
      <AppCard>
        <AppEmptyState
          description="We couldn't load your applications. Check your connection and try again."
          icon={<BriefcaseBusiness />}
          title="Applications are unavailable"
        />
      </AppCard>
    );
  return (
    <>
      <div className="space-y-6">
        <AppPageHeader
          title="Applications"
          description={`${data?.meta?.total ?? 0} ${data?.meta?.total === 1 ? "application" : "applications"} · Organize opportunities, status changes, and follow-ups.`}
          actions={<div className="flex items-center gap-2"><AppSegmentedControl className="w-42" onValueChange={(next) => next && setView(next as "table" | "board")} options={[{ value: "table", label: "Table", icon: <Table2 className="size-4" /> }, { value: "board", label: "Board", icon: <Kanban className="size-4" /> }]} value={view} /><AppButton onClick={() => setCreateOpen(true)}><Plus /> Add application</AppButton></div>}
        />
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5 shadow-sm">
          <div className="contents">
            <AppInput
              containerClassName="min-w-0 flex-1"
              leading={<Search />}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search company, role, location, notes..."
              value={searchInput}
            />
            <AppSelect
              ariaLabel="Filter by status"
              onValueChange={(value) =>
                updateUrl({ status: value === "all" ? undefined : value || undefined })
              }
              options={[
                { label: "All statuses", value: "all" },
                ...statuses.map((value) => ({ label: labels[value], value })),
              ]}
              triggerClassName="hidden"
              value={status || "all"}
            />
            <AppSelect
              ariaLabel="Filter by workplace"
              onValueChange={(value) =>
                updateUrl({ remoteType: value === "all" ? undefined : value || undefined })
              }
              options={[
                { label: "All workplaces", value: "all" },
                ...remoteTypes.map((value) => ({ label: humanize(value), value })),
              ]}
              triggerClassName="hidden"
              value={read("remoteType") || "all"}
            />
          </div>
          <div className="contents">
            <AppSelect
              ariaLabel="Filter by follow-up"
              onValueChange={(value) =>
                updateUrl({ followUp: value === "all" ? undefined : value || undefined })
              }
              options={[
                { label: "Any follow-up", value: "all" },
                { label: "Overdue", value: "overdue" },
                { label: "Today", value: "today" },
                { label: "Upcoming", value: "upcoming" },
                { label: "No follow-up", value: "none" },
              ]}
              triggerClassName="hidden"
              value={read("followUp") || "all"}
            />
            <AppSelect
              ariaLabel="Filter by tag"
              onValueChange={(value) =>
                updateUrl({ tag: value === "all" ? undefined : value || undefined })
              }
              options={[
                { label: "All tags", value: "all" },
                ...tags.map((tag) => ({ label: tag.name, value: tag.id })),
              ]}
              triggerClassName="hidden"
              value={read("tag") || "all"}
            />
          </div>
          <div className="contents">
            <AppPopover align="end" contentClassName="w-96" description="Narrow your workspace without losing your place." title="Filters" trigger={<AppButton className="shrink-0" tone={hasFilters ? "primary" : "outline"}><Filter /> Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}</AppButton>}>
              <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><AppSelect ariaLabel="Filter by status" onValueChange={(value) => updateUrl({ status: value === "all" ? undefined : value || undefined })} options={[{ label: "All statuses", value: "all" }, ...statuses.map((value) => ({ label: labels[value], value }))]} value={status || "all"} /><AppSelect ariaLabel="Filter by tag" onValueChange={(value) => updateUrl({ tag: value === "all" ? undefined : value || undefined })} options={[{ label: "All tags", value: "all" }, ...tags.map((tag) => ({ label: tag.name, value: tag.id }))]} value={read("tag") || "all"} /><AppSelect ariaLabel="Filter by workplace" onValueChange={(value) => updateUrl({ remoteType: value === "all" ? undefined : value || undefined })} options={[{ label: "All workplaces", value: "all" }, ...remoteTypes.map((value) => ({ label: humanize(value), value }))]} value={read("remoteType") || "all"} /><AppSelect ariaLabel="Filter by follow-up" onValueChange={(value) => updateUrl({ followUp: value === "all" ? undefined : value || undefined })} options={[{ label: "Any follow-up", value: "all" }, { label: "Overdue", value: "overdue" }, { label: "Today", value: "today" }, { label: "Upcoming", value: "upcoming" }, { label: "No follow-up", value: "none" }]} value={read("followUp") || "all"} /><AppSelect ariaLabel="Filter by employment" onValueChange={(value) => updateUrl({ employmentType: value === "all" ? undefined : value || undefined })} options={[{ label: "All employment", value: "all" }, ...employmentTypes.map((value) => ({ label: humanize(value), value }))]} value={read("employmentType") || "all"} /><AppInput aria-label="Filter by source" onChange={(event) => updateUrl({ source: event.target.value.trim() || undefined })} placeholder="Source" value={read("source")} /></div><div className="grid grid-cols-2 gap-3"><AppInput aria-label="Applied from" onChange={(event) => updateUrl({ appliedFrom: event.target.value || undefined })} type="date" value={read("appliedFrom")} /><AppInput aria-label="Applied to" onChange={(event) => updateUrl({ appliedTo: event.target.value || undefined })} type="date" value={read("appliedTo")} /></div><AppButton className="w-full" onClick={() => updateUrl({ includeArchived: read("includeArchived") === "true" ? undefined : "true" })} tone={read("includeArchived") === "true" ? "primary" : "outline"}>{read("includeArchived") === "true" ? "Showing archived applications" : "Include archived applications"}</AppButton></div>
            </AppPopover>
          </div>
          <AppSelect ariaLabel="Sort applications" onValueChange={(value) => updateUrl({ sort: value === "updatedAt" ? undefined : value || undefined })} options={[{ label: "Recently updated", value: "updatedAt" }, { label: "Company", value: "company" }, { label: "Applied date", value: "appliedAt" }, { label: "Status", value: "status" }]} triggerClassName="w-44 shrink-0" value={read("sort") || "updatedAt"} />
          {hasFilters ? <AppButton className="shrink-0" onClick={clearFilters} tone="ghost"><Filter /> Clear</AppButton> : null}
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {isFetching
              ? "Updating..."
              : `${data?.meta?.total ?? 0} application${(data?.meta?.total ?? 0) === 1 ? "" : "s"}`}
          </p>
        </div>
        {view === "board" ? <ApplicationBoard onMove={moveApplication} rows={rows} /> : rows.length ? (
          <AppCard className="overflow-hidden shadow-sm" padding="none">
            <AppTable
              columns={[
                {
                  key: "company",
                  header: "Company & role",
                  render: (row: Application) => (
                    <Link className="group block" href={`/applications/${row.id}`}>
                      <span className="block font-medium group-hover:text-primary">
                        {row.company}
                      </span>
                      <span className="block text-xs text-muted-foreground">{row.role}</span>
                    </Link>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => <StatusBadge status={row.status} />,
                },
                {
                  key: "tags",
                  header: "Tags",
                  render: (row) => row.tags.length ? <div className="flex max-w-48 flex-wrap gap-1.5">{row.tags.slice(0, 3).map((tag) => <AppBadge key={tag.id} size="sm">{tag.name}</AppBadge>)}</div> : <span className="text-muted-foreground">—</span>,
                },
                {
                  key: "details",
                  header: "Details",
                  render: (row) => (
                    <span className="text-muted-foreground">
                      {[row.location, row.remoteType ? humanize(row.remoteType) : ""]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </span>
                  ),
                },
                {
                  key: "followup",
                  header: "Follow-up",
                  render: (row) =>
                    row.nextFollowUpAt ? (
                      <span className="inline-flex items-center gap-1 text-warning">
                        <CalendarClock className="size-3.5" />
                        {new Date(row.nextFollowUpAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    ),
                },
                {
                  key: "open",
                  header: <span className="sr-only">Open application</span>,
                  align: "right",
                  render: (row) => (
                    <Link
                      aria-label={`Open ${row.company}`}
                      className="inline-flex text-muted-foreground hover:text-primary"
                      href={`/applications/${row.id}`}
                    >
                      <ChevronRight className="size-4" />
                    </Link>
                  ),
                },
              ]}
              getRowKey={(row) => row.id}
              rows={rows}
            />
            <div className="flex flex-col gap-3 border-t border-border bg-muted/20 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Showing {Math.min((page - 1) * (data?.meta?.limit ?? 20) + 1, data?.meta?.total ?? 0)}–{Math.min(page * (data?.meta?.limit ?? 20), data?.meta?.total ?? 0)} of {data?.meta?.total ?? 0} applications</p>
              <div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">Rows per page</span><AppSelect ariaLabel="Rows per page" onValueChange={(value) => updateUrl({ pageSize: value || "20", page: "1" })} options={[{ label: "10", value: "10" }, { label: "20", value: "20" }, { label: "50", value: "50" }]} size="sm" triggerClassName="w-18" value={String(pageSize)} /><AppPagination onPageChange={(nextPage) => updateUrl({ page: String(nextPage) })} page={page} totalPages={Math.max(1, data?.meta?.totalPages || 1)} /></div>
            </div>
          </AppCard>
        ) : (
          <AppCard>
            <AppEmptyState
              description={
                hasFilters
                  ? "Try a different search or clear your filters."
                  : "Keep every opportunity, contact, and follow-up in one calm workspace."
              }
              icon={<BriefcaseBusiness />}
              title={hasFilters ? "No matching applications" : "No applications yet"}
              action={
                <AppButton onClick={() => setCreateOpen(true)}>
                  <Plus /> Add application
                </AppButton>
              }
            />
          </AppCard>
        )}
        {view === "board" ? <div className="flex justify-end"><AppPagination onPageChange={(nextPage) => updateUrl({ page: String(nextPage) })} page={page} totalPages={Math.max(1, data?.meta?.totalPages || 1)} /></div> : null}
      </div>
      <AppModal
        bodyClassName="max-h-[75vh]"
        description="Capture the opportunity now and enrich it later."
        footer={
          <>
            <AppButton onClick={() => setCreateOpen(false)} tone="ghost">
              Cancel
            </AppButton>
            <AppButton
              disabled={!company.trim() || !role.trim()}
              loading={createState.isLoading}
              onClick={() => void submitCreate()}
            >
              Save application
            </AppButton>
          </>
        }
        onOpenChange={setCreateOpen}
        open={createOpen}
        title="Add application"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AppField label="Company" required>
              <AppInput onChange={(event) => setCompany(event.target.value)} value={company} />
            </AppField>
            <AppField label="Role" required>
              <AppInput onChange={(event) => setRole(event.target.value)} value={role} />
            </AppField>
            <AppField label="Job URL">
              <AppInput
                onChange={(event) => setJobUrl(event.target.value)}
                type="url"
                value={jobUrl}
              />
            </AppField>
            <AppField label="Location">
              <AppInput onChange={(event) => setLocation(event.target.value)} value={location} />
            </AppField>
            <AppField label="Workplace">
              <AppSelect
                onValueChange={(value) =>
                  setRemoteType(value === "unset" || !value ? "" : (value as RemoteType))
                }
                options={[
                  { label: "Not set", value: "unset" },
                  ...remoteTypes.map((value) => ({ label: humanize(value), value })),
                ]}
                value={remoteType || "unset"}
              />
            </AppField>
            <AppField label="Employment">
              <AppSelect
                onValueChange={(value) =>
                  setEmploymentType(value === "unset" || !value ? "" : (value as EmploymentType))
                }
                options={[
                  { label: "Not set", value: "unset" },
                  ...employmentTypes.map((value) => ({ label: humanize(value), value })),
                ]}
                value={employmentType || "unset"}
              />
            </AppField>
            <AppField label="Source">
              <AppInput
                onChange={(event) => setSource(event.target.value)}
                placeholder="LinkedIn, referral..."
                value={source}
              />
            </AppField>
            <AppField label="Applied date">
              <AppInput
                onChange={(event) => setAppliedAt(event.target.value)}
                type="date"
                value={appliedAt}
              />
            </AppField>
            <AppField label="Follow-up">
              <AppInput
                onChange={(event) => setNextFollowUpAt(event.target.value)}
                type="datetime-local"
                value={nextFollowUpAt}
              />
            </AppField>
            <AppField label="Tags">
              <AppMultiSelect
                onValueChange={setTagIds}
                options={tags.map((tag) => ({ label: tag.name, value: tag.id }))}
                value={tagIds}
              />
            </AppField>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <AppField label="Minimum salary">
              <AppInput
                inputMode="decimal"
                onChange={(event) => setSalaryMin(event.target.value)}
                value={salaryMin}
              />
            </AppField>
            <AppField label="Maximum salary">
              <AppInput
                inputMode="decimal"
                onChange={(event) => setSalaryMax(event.target.value)}
                value={salaryMax}
              />
            </AppField>
            <AppField label="Currency">
              <AppInput
                maxLength={3}
                onChange={(event) => setCurrency(event.target.value.toUpperCase())}
                value={currency}
              />
            </AppField>
          </div>
          <AppField label="Initial note">
            <AppTextarea
              onChange={(event) => setInitialNote(event.target.value)}
              value={initialNote}
            />
          </AppField>
        </div>
      </AppModal>
    </>
  );
}
