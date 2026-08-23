"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, CalendarClock, ChevronRight, Filter, Plus, Search } from "lucide-react";
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
  AppSelect,
  AppSkeleton,
  AppTable,
  AppTextarea,
  toast,
} from "@/components/app-ui";
import { useApplicationsQuery, useCreateApplicationMutation } from "@/store/api/applications.api";
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
const humanize = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
const queryValue = (params: URLSearchParams, key: string) => params.get(key) ?? "";
export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <AppBadge status={tones[status]}>{labels[status]}</AppBadge>;
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
  const [createApplication, createState] = useCreateApplicationMutation();
  const { data: tags = [] } = useTagsQuery();
  const page = Number(queryValue(searchParams, "page") || "1");
  const status = (queryValue(searchParams, "status") as ApplicationStatus | "") || "";
  const query = useMemo(
    () => ({
      page,
      pageSize: 20,
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
    [page, searchParams, status],
  );
  const { data, isError, isLoading, isFetching } = useApplicationsQuery(query);
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
  const hasFilters = searchParams.toString().length > 0;
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
      <div className="space-y-5">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <AppInput
              containerClassName="flex-1"
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
              triggerClassName="lg:w-40"
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
              triggerClassName="lg:w-40"
              value={read("remoteType") || "all"}
            />
            <AppButton aria-label="Add application" onClick={() => setCreateOpen(true)} size="icon">
              <Plus />
            </AppButton>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <AppSelect
              ariaLabel="Filter by employment"
              onValueChange={(value) =>
                updateUrl({ employmentType: value === "all" ? undefined : value || undefined })
              }
              options={[
                { label: "All employment", value: "all" },
                ...employmentTypes.map((value) => ({ label: humanize(value), value })),
              ]}
              triggerClassName="w-full"
              value={read("employmentType") || "all"}
            />
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
              triggerClassName="w-full"
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
              triggerClassName="w-full"
              value={read("tag") || "all"}
            />
            <AppInput
              aria-label="Filter by source"
              onChange={(event) => updateUrl({ source: event.target.value.trim() || undefined })}
              placeholder="Source"
              value={read("source")}
            />
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <AppInput
              aria-label="Applied from"
              onChange={(event) => updateUrl({ appliedFrom: event.target.value || undefined })}
              type="date"
              value={read("appliedFrom")}
            />
            <AppInput
              aria-label="Applied to"
              onChange={(event) => updateUrl({ appliedTo: event.target.value || undefined })}
              type="date"
              value={read("appliedTo")}
            />
            <AppButton
              onClick={() =>
                updateUrl({
                  includeArchived: read("includeArchived") === "true" ? undefined : "true",
                })
              }
              tone={read("includeArchived") === "true" ? "primary" : "outline"}
            >
              Archived
            </AppButton>
            {hasFilters ? (
              <AppButton onClick={clearFilters} tone="ghost">
                <Filter /> Clear filters
              </AppButton>
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {isFetching
              ? "Updating..."
              : `${data?.meta?.total ?? 0} application${(data?.meta?.total ?? 0) === 1 ? "" : "s"}`}
          </p>
          <AppSelect
            ariaLabel="Sort applications"
            onValueChange={(value) =>
              updateUrl({ sort: value === "updatedAt" ? undefined : value || undefined })
            }
            options={[
              { label: "Recently updated", value: "updatedAt" },
              { label: "Company", value: "company" },
              { label: "Applied date", value: "appliedAt" },
              { label: "Status", value: "status" },
            ]}
            triggerClassName="w-44"
            value={read("sort") || "updatedAt"}
          />
        </div>
        {rows.length ? (
          <AppCard className="overflow-hidden" padding="none">
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
        <div className="flex justify-end">
          <AppPagination
            onPageChange={(nextPage) => updateUrl({ page: String(nextPage) })}
            page={page}
            totalPages={Math.max(1, data?.meta?.totalPages || 1)}
          />
        </div>
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
