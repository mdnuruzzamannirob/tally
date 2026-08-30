"use client";

import { useState } from "react";
import { ArrowUpDown, Check, ChevronDown, Filter, Kanban, Table2, X, Search } from "lucide-react";
import { format, parseISO } from "date-fns";
import { AppCheckbox, AppDateRangePicker, AppInput, AppPopover } from "@/components/app-ui";
import type { Tag } from "@/types/tag.types";
import type { ApplicationStatus, EmploymentType, RemoteType } from "@/types/application.types";
import {
  applicationLabels,
  applicationStatuses,
  employmentTypes,
  humanizeApplicationValue,
  remoteTypes,
} from "../application-config";

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
  totalCount: number;
  updateUrl: (changes: Record<string, string | undefined>) => void;
  view: "table" | "board";
};

const sortLabels: Record<string, string> = {
  updatedAt: "Recently updated",
  createdAt: "Recently created",
  company: "Company name",
  role: "Role name",
  appliedAt: "Applied date",
  nextFollowUpAt: "Follow-up date",
  status: "Status (pipeline)",
};

const followUpOptions = [
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "none", label: "None" },
];

function FilterPill({
  label,
  selected,
  dot,
  onClick,
}: {
  label: string;
  selected: boolean;
  dot?: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-xs font-medium transition-colors ${
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-foreground hover:bg-muted"
      }`}
      onClick={onClick}
      type="button"
    >
      {dot && <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: dot }} />}
      {label}
    </button>
  );
}

export function ApplicationToolbar({
  activeFilterCount,
  hasFilters,
  onClearFilters,
  onCreate,
  onSearchChange,
  onViewChange,
  read,
  searchInput,
  tags,
  totalCount,
  updateUrl,
  view,
}: ApplicationToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const currentStatus = read("status");
  const currentTag = read("tag");
  const currentFollowUp = read("followUp");
  const currentRemote = read("remoteType");
  const currentEmployment = read("employmentType");
  const currentSource = read("source");
  const currentAppliedFrom = read("appliedFrom");
  const currentAppliedTo = read("appliedTo");
  const currentIncludeArchived = read("includeArchived") === "true";
  const currentSort = read("sort") || "updatedAt";
  const currentOrder = read("order") || "desc";

  const toggleStatus = (st: string) => {
    updateUrl({ status: currentStatus === st ? undefined : st });
  };

  const toggleTag = (tgId: string) => {
    updateUrl({ tag: currentTag === tgId ? undefined : tgId });
  };

  const toggleFollowUp = (fu: string) => {
    updateUrl({ followUp: currentFollowUp === fu ? undefined : fu });
  };

  const toggleRemote = (rt: string) => {
    updateUrl({ remoteType: currentRemote === rt ? undefined : rt });
  };

  const toggleEmployment = (et: string) => {
    updateUrl({ employmentType: currentEmployment === et ? undefined : et });
  };

  const activeChips: Array<{ key: string; label: string; value: string; onRemove: () => void }> =
    [];
  if (currentStatus && applicationLabels[currentStatus as ApplicationStatus]) {
    activeChips.push({
      key: "status",
      label: "Status",
      value: applicationLabels[currentStatus as ApplicationStatus],
      onRemove: () => updateUrl({ status: undefined }),
    });
  }
  if (currentTag) {
    const tg = tags.find((t) => t.id === currentTag);
    if (tg) {
      activeChips.push({
        key: "tag",
        label: "Tag",
        value: tg.name,
        onRemove: () => updateUrl({ tag: undefined }),
      });
    }
  }
  if (currentFollowUp) {
    activeChips.push({
      key: "followUp",
      label: "Follow-up",
      value: followUpOptions.find((f) => f.value === currentFollowUp)?.label ?? currentFollowUp,
      onRemove: () => updateUrl({ followUp: undefined }),
    });
  }
  if (currentRemote) {
    activeChips.push({
      key: "remoteType",
      label: "Remote",
      value: humanizeApplicationValue(currentRemote as RemoteType),
      onRemove: () => updateUrl({ remoteType: undefined }),
    });
  }
  if (currentEmployment) {
    activeChips.push({
      key: "employmentType",
      label: "Employment",
      value: humanizeApplicationValue(currentEmployment as EmploymentType),
      onRemove: () => updateUrl({ employmentType: undefined }),
    });
  }
  if (currentSource) {
    activeChips.push({
      key: "source",
      label: "Source",
      value: currentSource,
      onRemove: () => updateUrl({ source: undefined }),
    });
  }
  if (currentAppliedFrom || currentAppliedTo) {
    activeChips.push({
      key: "dates",
      label: "Applied",
      value: `${currentAppliedFrom || "…"} → ${currentAppliedTo || "…"}`,
      onRemove: () => updateUrl({ appliedFrom: undefined, appliedTo: undefined }),
    });
  }
  if (currentIncludeArchived) {
    activeChips.push({
      key: "archived",
      label: "Archived",
      value: "Includes archived",
      onRemove: () => updateUrl({ includeArchived: undefined }),
    });
  }

  return (
    <div className="space-y-3">
      {/* Searchbar left (full available space), filters, sort, and view tab list right - all same h-9 height */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Side: Searchbar (occupies full available left space, exactly h-9) */}
        <div className="flex-1 min-w-0">
          <AppInput
            className="h-9 text-sm"
            leading={<Search className="size-4 text-muted-foreground" />}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search applications..."
            value={searchInput}
          />
        </div>

        {/* Right Side: Filters, Sort, View Toggle (Styled as tab list), Count */}
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          {/* Filters popover without title header */}
          <AppPopover
            align="end"
            contentClassName="w-[360px] p-3.5 shadow-md border border-border"
            onOpenChange={setFilterOpen}
            open={filterOpen}
            trigger={
              <button
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
                type="button"
              >
                <Filter className="size-4 opacity-75" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className="size-3.5 opacity-50" />
              </button>
            }
          >
            <div className="space-y-3 text-xs">
              <div>
                <div className="mb-1.5 font-medium text-muted-foreground">Status</div>
                <div className="flex flex-wrap gap-1.5">
                  {applicationStatuses.map((st) => (
                    <FilterPill
                      key={st}
                      label={applicationLabels[st]}
                      selected={currentStatus === st}
                      onClick={() => toggleStatus(st)}
                    />
                  ))}
                </div>
              </div>

              {tags.length > 0 && (
                <div>
                  <div className="mb-1.5 font-medium text-muted-foreground">Tags</div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tg) => (
                      <FilterPill
                        key={tg.id}
                        label={tg.name}
                        selected={currentTag === tg.id}
                        dot={tg.color || "#6366f1"}
                        onClick={() => toggleTag(tg.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-1.5 font-medium text-muted-foreground">Follow-up</div>
                <div className="flex flex-wrap gap-1.5">
                  {followUpOptions.map((fu) => (
                    <FilterPill
                      key={fu.value}
                      label={fu.label}
                      selected={currentFollowUp === fu.value}
                      onClick={() => toggleFollowUp(fu.value)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1.5 font-medium text-muted-foreground">Remote type</div>
                <div className="flex flex-wrap gap-1.5">
                  {remoteTypes.map((rt) => (
                    <FilterPill
                      key={rt}
                      label={humanizeApplicationValue(rt)}
                      selected={currentRemote === rt}
                      onClick={() => toggleRemote(rt)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1.5 font-medium text-muted-foreground">Employment type</div>
                <div className="flex flex-wrap gap-1.5">
                  {employmentTypes.map((et: EmploymentType) => (
                    <FilterPill
                      key={et}
                      label={humanizeApplicationValue(et)}
                      selected={currentEmployment === et}
                      onClick={() => toggleEmployment(et)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1 font-medium text-muted-foreground">Source (exact match)</div>
                <AppInput
                  aria-label="Filter by source"
                  className="h-8 text-xs"
                  onChange={(event) =>
                    updateUrl({ source: event.target.value.trim() || undefined })
                  }
                  placeholder="e.g. LinkedIn"
                  value={currentSource}
                />
              </div>

              <div>
                <div className="mb-1 font-medium text-muted-foreground">Applied between</div>
                <AppDateRangePicker
                  className="h-8 text-xs w-full"
                  onValueChange={(range) => {
                    updateUrl({
                      appliedFrom: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
                      appliedTo: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
                    });
                  }}
                  placeholder="Select applied date range"
                  value={
                    currentAppliedFrom
                      ? {
                          from: parseISO(currentAppliedFrom),
                          to: currentAppliedTo ? parseISO(currentAppliedTo) : undefined,
                        }
                      : undefined
                  }
                />
              </div>

              <div className="pt-0.5">
                <AppCheckbox
                  checked={currentIncludeArchived}
                  label={
                    <span className="text-xs text-foreground font-normal">Include archived</span>
                  }
                  onCheckedChange={(checked) =>
                    updateUrl({ includeArchived: checked ? "true" : undefined })
                  }
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-2.5">
                <button
                  className="inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={onClearFilters}
                  type="button"
                >
                  Clear all
                </button>
                <button
                  className="inline-flex h-7 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
                  onClick={() => setFilterOpen(false)}
                  type="button"
                >
                  Done
                </button>
              </div>
            </div>
          </AppPopover>

          {/* Sort popover without title header */}
          <AppPopover
            align="end"
            contentClassName="w-52 p-1.5 shadow-md border border-border"
            trigger={
              <button
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
                type="button"
              >
                <ArrowUpDown className="size-4 opacity-75" />
                <span>{sortLabels[currentSort] || "Recently updated"}</span>
                <ChevronDown className="size-3.5 opacity-50" />
              </button>
            }
          >
            <div className="space-y-0.5 text-xs">
              <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sort by
              </div>
              {Object.entries(sortLabels).map(([sortKey, sortTitle]) => {
                const selected = currentSort === sortKey;
                return (
                  <button
                    className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted ${
                      selected ? "font-semibold text-primary" : "text-foreground"
                    }`}
                    key={sortKey}
                    onClick={() =>
                      updateUrl({ sort: sortKey === "updatedAt" ? undefined : sortKey })
                    }
                    type="button"
                  >
                    <span>{sortTitle}</span>
                    {selected && <Check className="size-3.5 text-primary" />}
                  </button>
                );
              })}
              <div className="my-1 border-t border-border" />
              <button
                className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted ${
                  currentOrder === "desc" ? "font-semibold text-primary" : "text-foreground"
                }`}
                onClick={() => updateUrl({ order: undefined })}
                type="button"
              >
                <span>Order: Descending</span>
                {currentOrder === "desc" && <Check className="size-3.5 text-primary" />}
              </button>
              <button
                className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted ${
                  currentOrder === "asc" ? "font-semibold text-primary" : "text-foreground"
                }`}
                onClick={() => updateUrl({ order: "asc" })}
                type="button"
              >
                <span>Order: Ascending</span>
                {currentOrder === "asc" && <Check className="size-3.5 text-primary" />}
              </button>
            </div>
          </AppPopover>

          {/* List / Board Selection Styled with AppTabs styling pattern (Primary color highlight box, h-9 height) */}
          <div className="inline-flex h-9 box-border rounded-lg border border-border bg-muted/60 p-0.5 shadow-2xs">
            <button
              className={`inline-flex w-20 shrink-0 items-center justify-center gap-1.5 rounded-md border border-transparent px-3.5 text-xs font-semibold transition-colors ${
                view === "table"
                  ? "bg-primary-subtle text-primary border border-transparent shadow-3xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onViewChange("table")}
              type="button"
            >
              <Table2 className="size-3.5" />
              List
            </button>
            <button
              className={`inline-flex w-20 shrink-0 items-center justify-center gap-1.5 rounded-md border border-transparent px-3.5 text-xs font-semibold transition-colors ${
                view === "board"
                  ? "bg-primary-subtle text-primary border border-transparent shadow-3xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onViewChange("board")}
              type="button"
            >
              <Kanban className="size-3.5" />
              Board
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips with Clear all button at the end */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {activeChips.map((chip) => (
            <span
              className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-2.5 py-1 text-xs shadow-xs"
              key={chip.key}
            >
              <strong className="font-medium text-muted-foreground">{chip.label}:</strong>
              <span className="text-foreground">{chip.value}</span>
              <button
                aria-label={`Remove ${chip.label} filter`}
                className="rounded text-muted-foreground hover:text-danger"
                onClick={chip.onRemove}
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
          <button
            className="text-xs font-semibold text-primary hover:underline ml-1"
            onClick={onClearFilters}
            type="button"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
