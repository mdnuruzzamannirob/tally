"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CalendarClock, ChevronRight, Plus } from "lucide-react";
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
  AppSelect,
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
import { ApplicationBoard } from "./components/ApplicationBoard";
import { ApplicationStatusBadge } from "./components/ApplicationStatusBadge";
import { ApplicationToolbar } from "./components/ApplicationToolbar";
import { applicationLabels as labels, applicationStatuses as statuses, employmentTypes, humanizeApplicationValue as humanize, remoteTypes } from "./application-config";
const queryValue = (params: URLSearchParams, key: string) => params.get(key) ?? "";
export { ApplicationStatusBadge as StatusBadge } from "./components/ApplicationStatusBadge";

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
        />
        <ApplicationToolbar activeFilterCount={activeFilterCount} hasFilters={hasFilters} onClearFilters={clearFilters} onCreate={() => setCreateOpen(true)} onSearchChange={setSearchInput} onViewChange={setView} read={read} searchInput={searchInput} tags={tags} updateUrl={updateUrl} view={view} />
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
                  render: (row) => <ApplicationStatusBadge status={row.status} />,
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
