"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CalendarClock, Plus } from "lucide-react";
import {
  AppBadge,
  AppButton,
  AppCard,
  AppConfirmDialog,
  AppEmptyState,
  AppField,
  AppInput,
  AppMobileList,
  AppModal,
  AppMultiSelect,
  AppPagination,
  AppSelect,
  AppSkeleton,
  AppTextarea,
  toast,
} from "@/components/app-ui";
import {
  useApplicationsQuery,
  useArchiveApplicationMutation,
  useChangeApplicationStatusMutation,
  useCreateApplicationMutation,
  useDeleteApplicationMutation,
  useUpdateApplicationMutation,
} from "@/store/api/applications.api";
import { useTagsQuery } from "@/store/api/tags.api";
import type {
  Application,
  ApplicationStatus,
  EmploymentType,
  RemoteType,
} from "@/types/application.types";
import { ApplicationBoard } from "./components/ApplicationBoard";
import { ApplicationStatusBadge } from "./components/ApplicationStatusBadge";
import { ApplicationTable } from "./components/ApplicationTable";
import { ApplicationToolbar } from "./components/ApplicationToolbar";
import {
  applicationLabels as labels,
  employmentTypes,
  humanizeApplicationValue as humanize,
  remoteTypes,
} from "./application-config";

const queryValue = (params: URLSearchParams, key: string) => params.get(key) ?? "";
export { ApplicationStatusBadge as StatusBadge } from "./components/ApplicationStatusBadge";

export function ApplicationWorkspace() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const read = useCallback((key: string) => queryValue(searchParams, key), [searchParams]);

  const [createOpen, setCreateOpen] = useState(() => queryValue(searchParams, "create") === "1");
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [statusTarget, setStatusTarget] = useState<Application | null>(null);
  const [targetNewStatus, setTargetNewStatus] = useState<ApplicationStatus>("APPLIED");
  const [statusNote, setStatusNote] = useState("");
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
  const [updateApplication, updateState] = useUpdateApplicationMutation();
  const [archiveApplication] = useArchiveApplicationMutation();
  const [deleteApplication] = useDeleteApplicationMutation();
  const [changeApplicationStatus, changeStatusState] = useChangeApplicationStatusMutation();

  const { data: tags = [] } = useTagsQuery();
  const page = Number(queryValue(searchParams, "page") || "1");
  const pageSize = [10, 20, 50].includes(Number(queryValue(searchParams, "pageSize")))
    ? Number(queryValue(searchParams, "pageSize"))
    : 20;
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
              | "overdue"
              | "today"
              | "upcoming"
              | "none",
          }
        : {}),
      ...(queryValue(searchParams, "includeArchived") === "true" ? { includeArchived: true } : {}),
      sort: (queryValue(searchParams, "sort") || "updatedAt") as
        | "updatedAt"
        | "createdAt"
        | "company"
        | "role"
        | "appliedAt"
        | "nextFollowUpAt"
        | "status",
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

  const openStatusChangeModal = (app: Application) => {
    setStatusTarget(app);
    setTargetNewStatus(app.status);
    setStatusNote("");
  };

  const moveApplication = async (id: string, toStatus: ApplicationStatus) => {
    const app = rows.find((r) => r.id === id);
    if (!app) return false;
    // If called directly with a new status (e.g., from drag & drop)
    if (toStatus !== app.status) {
      try {
        await changeApplicationStatus({
          id,
          body: { toStatus },
        }).unwrap();
        toast.success(`Status updated to ${labels[toStatus]}`);
        return true;
      } catch {
        toast.error("Could not update status.");
        return false;
      }
    } else {
      // Called from menu item without specific new status -> open modal
      openStatusChangeModal(app);
      return true;
    }
  };

  const submitStatusChange = async () => {
    if (!statusTarget) return;
    try {
      await changeApplicationStatus({
        id: statusTarget.id,
        body: {
          toStatus: targetNewStatus,
          ...(statusNote.trim() ? { note: statusNote.trim() } : {}),
        },
      }).unwrap();
      toast.success("Status updated.");
      setStatusTarget(null);
      setStatusNote("");
    } catch {
      toast.error("Could not update status.");
    }
  };

  const resetForm = () => {
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
    setEditApp(null);
  };

  const openEditModal = (app: Application) => {
    setCompany(app.company);
    setRole(app.role);
    setJobUrl(app.jobUrl ?? "");
    setLocation(app.location ?? "");
    setSource(app.source ?? "");
    setAppliedAt(app.appliedAt ? app.appliedAt.slice(0, 10) : "");
    setNextFollowUpAt(
      app.nextFollowUpAt ? new Date(app.nextFollowUpAt).toISOString().slice(0, 16) : "",
    );
    setSalaryMin(app.salaryMin !== null && app.salaryMin !== undefined ? String(app.salaryMin) : "");
    setSalaryMax(app.salaryMax !== null && app.salaryMax !== undefined ? String(app.salaryMax) : "");
    setCurrency(app.currency ?? "USD");
    setTagIds(app.tags.map((t) => t.id));
    setRemoteType(app.remoteType ?? "");
    setEmploymentType(app.employmentType ?? "");
    setEditApp(app);
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
      resetForm();
      setCreateOpen(false);
    } catch {
      toast.error("Could not add application.");
    }
  };

  const submitUpdate = async () => {
    if (!editApp || !company.trim() || !role.trim()) return;
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
        id: editApp.id,
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
      toast.success("Application updated.");
      resetForm();
      setEditApp(null);
    } catch {
      toast.error("Could not update application.");
    }
  };

  const archiveApp = async (app: Application) => {
    try {
      await archiveApplication({ id: app.id, archived: !app.archivedAt }).unwrap();
      toast.success(app.archivedAt ? `${app.company} unarchived.` : `${app.company} archived.`);
    } catch {
      toast.error("Could not update archive status.");
    }
  };

  const confirmDeleteApp = async () => {
    if (!deleteTarget) return;
    try {
      await deleteApplication(deleteTarget.id).unwrap();
      toast.success("Application deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Could not delete application.");
    }
  };

  const activeFilterCount = [
    "search",
    "status",
    "tag",
    "remoteType",
    "employmentType",
    "source",
    "appliedFrom",
    "appliedTo",
    "followUp",
    "includeArchived",
  ].filter((key) => Boolean(read(key))).length;
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
      <div className="space-y-4">
        {/* Page head: title + Add application button (matches prototype page-head) */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold">Applications</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Browse, search, filter, and manage your applications.
            </p>
          </div>
          <AppButton
            onClick={() => {
              resetForm();
              setCreateOpen(true);
            }}
          >
            <Plus className="size-4" /> Add application
          </AppButton>
        </div>
        <ApplicationToolbar
          activeFilterCount={activeFilterCount}
          hasFilters={hasFilters}
          onClearFilters={clearFilters}
          onCreate={() => {
            resetForm();
            setCreateOpen(true);
          }}
          onSearchChange={setSearchInput}
          onViewChange={setView}
          read={read}
          searchInput={searchInput}
          tags={tags}
          totalCount={data?.meta?.total ?? 0}
          updateUrl={updateUrl}
          view={view}
        />

        {view === "board" ? (
          <>
            <ApplicationBoard
              onArchive={archiveApp}
              onDelete={(app) => setDeleteTarget(app)}
              onEdit={openEditModal}
              onMove={moveApplication}
              rows={rows}
            />
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
              <p className="text-xs text-muted-foreground sm:text-sm">
                Showing {Math.min((page - 1) * pageSize + 1, data?.meta?.total ?? 0)}–{Math.min(page * pageSize, data?.meta?.total ?? 0)} of{" "}
                {data?.meta?.total ?? 0} applications
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Cards per page</span>
                <AppSelect
                  ariaLabel="Cards per page"
                  onValueChange={(value) =>
                    updateUrl({ pageSize: value || "20", page: "1" })
                  }
                  options={[
                    { label: "10", value: "10" },
                    { label: "20", value: "20" },
                    { label: "50", value: "50" },
                  ]}
                  size="sm"
                  triggerClassName="w-18"
                  value={String(pageSize)}
                />
                <AppPagination
                  onPageChange={(nextPage) => updateUrl({ page: String(nextPage) })}
                  page={page}
                  totalPages={Math.max(1, data?.meta?.totalPages || 1)}
                />
              </div>
            </div>
          </>
        ) : rows.length ? (
          <>
            <div className="hidden sm:block">
              <ApplicationTable
                onArchive={archiveApp}
                onDelete={(app) => setDeleteTarget(app)}
                onEdit={openEditModal}
                onMove={moveApplication}
                onPageChange={(nextPage) => updateUrl({ page: String(nextPage) })}
                onPageSizeChange={(newSize) =>
                  updateUrl({ pageSize: newSize || "20", page: "1" })
                }
                page={page}
                pageSize={pageSize}
                rows={rows}
                total={data?.meta?.total ?? 0}
                totalPages={data?.meta?.totalPages || 1}
              />
            </div>
            <div className="space-y-3 sm:hidden">
              <AppMobileList
                getItemKey={(item) => item.id}
                items={rows}
                renderItem={(item) => (
                  <div
                    className="cursor-pointer space-y-2"
                    onClick={() => router.push(`/applications/${item.id}`)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <span>{item.company}</span>
                          {item.archivedAt ? (
                            <AppBadge size="sm" status="neutral">
                              Archived
                            </AppBadge>
                          ) : null}
                        </div>
                        <div className="text-xs text-muted-foreground">{item.role}</div>
                      </div>
                      <ApplicationStatusBadge status={item.status} />
                    </div>
                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((t) => (
                          <span
                            className="inline-flex items-center gap-1 rounded border border-border bg-secondary px-1.5 py-0.5 text-[11px] font-medium"
                            key={t.id}
                          >
                            <span
                              className="size-1.5 rounded-full"
                              style={{ backgroundColor: t.color || "var(--primary)" }}
                            />
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-border/50 pt-1 text-xs text-muted-foreground">
                      <span>
                        {item.location || (item.remoteType ? humanize(item.remoteType) : "—")}
                      </span>
                      {item.nextFollowUpAt ? (
                        <span className="inline-flex items-center gap-1 text-warning">
                          <CalendarClock className="size-3" />
                          {new Date(item.nextFollowUpAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span>Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                )}
              />
              <div className="flex justify-center">
                <AppPagination
                  onPageChange={(nextPage) => updateUrl({ page: String(nextPage) })}
                  page={page}
                  totalPages={Math.max(1, data?.meta?.totalPages || 1)}
                />
              </div>
            </div>
          </>
        ) : (
          <AppCard>
            <AppEmptyState
              action={
                <AppButton onClick={() => setCreateOpen(true)}>
                  <Plus /> Add application
                </AppButton>
              }
              description={
                hasFilters
                  ? "Try a different search or clear your filters."
                  : "Keep every opportunity, contact, and follow-up in one calm workspace."
              }
              icon={<BriefcaseBusiness />}
              title={hasFilters ? "No matching applications" : "No applications yet"}
            />
          </AppCard>
        )}
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

      <AppModal
        bodyClassName="max-h-[75vh]"
        description="Update key application details."
        footer={
          <>
            <AppButton onClick={() => setEditApp(null)} tone="ghost">
              Cancel
            </AppButton>
            <AppButton
              disabled={!company.trim() || !role.trim()}
              loading={updateState.isLoading}
              onClick={() => void submitUpdate()}
            >
              Save changes
            </AppButton>
          </>
        }
        onOpenChange={(open) => {
          if (!open) setEditApp(null);
        }}
        open={Boolean(editApp)}
        title="Edit application"
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
        </div>
      </AppModal>

      <AppModal
        footer={
          <>
            <AppButton onClick={() => setStatusTarget(null)} tone="ghost">
              Cancel
            </AppButton>
            <AppButton
              disabled={statusTarget?.status === targetNewStatus}
              loading={changeStatusState.isLoading}
              onClick={() => void submitStatusChange()}
            >
              Update status
            </AppButton>
          </>
        }
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null);
        }}
        open={Boolean(statusTarget)}
        title="Change status"
      >
        {statusTarget && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{statusTarget.company}</span> · {statusTarget.role} — currently{" "}
              <ApplicationStatusBadge status={statusTarget.status} />
            </p>
            <AppField label="New status" required>
              <AppSelect
                onValueChange={(val) => setTargetNewStatus(val as ApplicationStatus)}
                options={Object.entries(labels).map(([val, lbl]) => ({
                  label: lbl,
                  value: val,
                }))}
                value={targetNewStatus}
              />
            </AppField>
            <div>
              <AppField label="Note (optional)">
                <AppTextarea
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Recruiter confirmed technical interview"
                  value={statusNote}
                />
              </AppField>
              <p className="mt-1 text-[11px] text-muted-foreground">Saved with the status history entry.</p>
            </div>
          </div>
        )}
      </AppModal>

      <AppConfirmDialog
        confirmLabel="Delete"
        description="This will permanently delete this application along with all its notes, interviews, and status history. This action cannot be undone."
        onConfirm={() => void confirmDeleteApp()}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        open={Boolean(deleteTarget)}
        title={`Delete application for ${deleteTarget?.company ?? ""}?`}
      />
    </>
  );
}
