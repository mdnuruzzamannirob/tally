"use client";

import { Filter, Kanban, Plus, Search, Table2 } from "lucide-react";
import { AppButton, AppInput, AppPopover, AppSelect, AppSegmentedControl } from "@/components/app-ui";
import type { Tag } from "@/types/tag.types";
import type { ApplicationStatus, EmploymentType, RemoteType } from "@/types/application.types";
import { applicationLabels, applicationStatuses, employmentTypes, humanizeApplicationValue, remoteTypes } from "../application-config";

type ApplicationToolbarProps = {
  activeFilterCount: number;
  hasFilters: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  onSearchChange: (value: string) => void;
  onViewChange: (value: "table" | "board") => void;
  read: (key: string) => string;
  searchInput: string;
  tags: Tag[];
  updateUrl: (changes: Record<string, string | undefined>) => void;
  view: "table" | "board";
};

const optionValue = (value: string) => value === "all" ? undefined : value || undefined;

export function ApplicationToolbar({ activeFilterCount, hasFilters, onClearFilters, onCreate, onSearchChange, onViewChange, read, searchInput, tags, updateUrl, view }: ApplicationToolbarProps) {
  const selectStatus = (value: string | null) => updateUrl({ status: optionValue(value ?? "") });
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-2.5 shadow-sm">
      <AppInput containerClassName="min-w-64 flex-1" leading={<Search />} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search company, role, location, notes..." value={searchInput} />
      <AppSegmentedControl className="order-first w-42 sm:order-none" onValueChange={(next) => next && onViewChange(next as "table" | "board")} options={[{ value: "table", label: "Table", icon: <Table2 className="size-4" /> }, { value: "board", label: "Board", icon: <Kanban className="size-4" /> }]} value={view} />
      <AppPopover align="end" contentClassName="w-96" description="Narrow your workspace without losing your place." title="Filters" trigger={<AppButton tone={hasFilters ? "primary" : "outline"}><Filter /> Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}</AppButton>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <AppSelect ariaLabel="Filter by status" onValueChange={selectStatus} options={[{ label: "All statuses", value: "all" }, ...applicationStatuses.map((value) => ({ label: applicationLabels[value], value }))]} value={read("status") || "all"} />
            <AppSelect ariaLabel="Filter by tag" onValueChange={(value) => updateUrl({ tag: optionValue(value ?? "") })} options={[{ label: "All tags", value: "all" }, ...tags.map((tag) => ({ label: tag.name, value: tag.id }))]} value={read("tag") || "all"} />
            <AppSelect ariaLabel="Filter by workplace" onValueChange={(value) => updateUrl({ remoteType: optionValue(value ?? "") })} options={[{ label: "All workplaces", value: "all" }, ...remoteTypes.map((value) => ({ label: humanizeApplicationValue(value), value }))]} value={read("remoteType") || "all"} />
            <AppSelect ariaLabel="Filter by follow-up" onValueChange={(value) => updateUrl({ followUp: optionValue(value ?? "") })} options={[{ label: "Any follow-up", value: "all" }, { label: "Overdue", value: "overdue" }, { label: "Today", value: "today" }, { label: "Upcoming", value: "upcoming" }, { label: "No follow-up", value: "none" }]} value={read("followUp") || "all"} />
            <AppSelect ariaLabel="Filter by employment" onValueChange={(value) => updateUrl({ employmentType: optionValue(value ?? "") })} options={[{ label: "All employment", value: "all" }, ...employmentTypes.map((value: EmploymentType) => ({ label: humanizeApplicationValue(value), value }))]} value={read("employmentType") || "all"} />
            <AppInput aria-label="Filter by source" onChange={(event) => updateUrl({ source: event.target.value.trim() || undefined })} placeholder="Source" value={read("source")} />
          </div>
          <div className="grid grid-cols-2 gap-3"><AppInput aria-label="Applied from" onChange={(event) => updateUrl({ appliedFrom: event.target.value || undefined })} type="date" value={read("appliedFrom")} /><AppInput aria-label="Applied to" onChange={(event) => updateUrl({ appliedTo: event.target.value || undefined })} type="date" value={read("appliedTo")} /></div>
          <AppButton className="w-full" onClick={() => updateUrl({ includeArchived: read("includeArchived") === "true" ? undefined : "true" })} tone={read("includeArchived") === "true" ? "primary" : "outline"}>{read("includeArchived") === "true" ? "Showing archived applications" : "Include archived applications"}</AppButton>
        </div>
      </AppPopover>
      <AppSelect ariaLabel="Sort applications" onValueChange={(value) => updateUrl({ sort: value === "updatedAt" ? undefined : value || undefined })} options={[{ label: "Recently updated", value: "updatedAt" }, { label: "Company", value: "company" }, { label: "Applied date", value: "appliedAt" }, { label: "Status", value: "status" }]} triggerClassName="w-44 shrink-0" value={read("sort") || "updatedAt"} />
      {hasFilters ? <AppButton className="shrink-0" onClick={onClearFilters} tone="ghost"><Filter /> Clear</AppButton> : null}
      <AppButton className="ml-auto" onClick={onCreate}><Plus /> Add application</AppButton>
    </div>
  );
}
