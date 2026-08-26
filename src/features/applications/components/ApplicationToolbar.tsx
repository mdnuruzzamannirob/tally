"use client";

import { Check, ChevronDown, Filter, Kanban, Plus, Search, Table2, X } from "lucide-react";
import {
  AppBadge,
  AppButton,
  AppInput,
  AppPopover,
  AppSegmentedControl,
} from "@/components/app-ui";
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
  updateUrl,
  view,
}: ApplicationToolbarProps) {
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

  const activeChips: Array<{ key: string; label: string; value: string; onRemove: () => void }> = [];
  if (currentStatus && applicationLabels[currentStatus as ApplicationStatus]) {
    activeChips.push({
      key: "status",
      label: "Status",
      value: applicationLabels[currentStatus as ApplicationStatus],
      onRemove: () => updateUrl({ status: undefined }),
    });
  }
  if (currentTag) {
    const matchedTag = tags.find((t) => t.id === currentTag);
    if (matchedTag) {
      activeChips.push({
        key: "tag",
        label: "Tag",
        value: matchedTag.name,
        onRemove: () => updateUrl({ tag: undefined }),
      });
    }
  }
  if (currentFollowUp) {
    const matchedFu = followUpOptions.find((o) => o.value === currentFollowUp);
    activeChips.push({
      key: "followUp",
      label: "Follow-up",
      value: matchedFu ? matchedFu.label : currentFollowUp,
      onRemove: () => updateUrl({ followUp: undefined }),
    });
  }
  if (currentRemote) {
    activeChips.push({
      key: "remote",
      label: "Remote",
      value: humanizeApplicationValue(currentRemote),
      onRemove: () => updateUrl({ remoteType: undefined }),
    });
  }
  if (currentEmployment) {
    activeChips.push({
      key: "employment",
      label: "Employment",
      value: humanizeApplicationValue(currentEmployment),
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
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-2.5 shadow-sm">
        <AppInput
          containerClassName="min-w-64 flex-1"
          leading={<Search />}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search applications..."
          value={searchInput}
        />
        <AppSegmentedControl
          className="order-first w-42 sm:order-none"
          onValueChange={(next) => next && onViewChange(next as "table" | "board")}
          options={[
            { value: "table", label: "List", icon: <Table2 className="size-4" /> },
            { value: "board", label: "Board", icon: <Kanban className="size-4" /> },
          ]}
          value={view}
        />

        {/* Filter Popover */}
        <AppPopover
          align="start"
          contentClassName="w-[360px] p-4"
          description="Narrow your applications list or board."
          title="Filter applications"
          trigger={
            <AppButton tone={hasFilters ? "primary" : "outline"}>
              <Filter /> Filters
              {activeFilterCount ? (
                <span className="ml-1 rounded bg-secondary px-1.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  {activeFilterCount}
                </span>
              ) : (
                <ChevronDown className="size-3.5 opacity-60" />
              )}
            </AppButton>
          }
        >
          <div className="space-y-3.5 pt-1 text-xs">
            <div>
              <div className="mb-1.5 font-medium text-muted-foreground">Status</div>
              <div className="flex flex-wrap gap-1.5">
                {applicationStatuses.map((st) => {
                  const selected = currentStatus === st;
                  return (
                    <button
                      className={`inline-flex items-center rounded border px-2 py-1 text-xs font-medium transition-colors ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-foreground hover:bg-muted"
                      }`}
                      key={st}
                      onClick={() => toggleStatus(st)}
                      type="button"
                    >
                      {applicationLabels[st]}
                    </button>
                  );
                })}
              </div>
            </div>

            {tags.length > 0 && (
              <div>
                <div className="mb-1.5 font-medium text-muted-foreground">Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tg) => {
                    const selected = currentTag === tg.id;
                    return (
                      <button
                        className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-xs font-medium transition-colors ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-secondary text-foreground hover:bg-muted"
                        }`}
                        key={tg.id}
                        onClick={() => toggleTag(tg.id)}
                        type="button"
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: tg.color || "var(--primary)" }}
                        />
                        {tg.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="mb-1.5 font-medium text-muted-foreground">Follow-up</div>
              <div className="flex flex-wrap gap-1.5">
                {followUpOptions.map((fu) => {
                  const selected = currentFollowUp === fu.value;
                  return (
                    <button
                      className={`inline-flex items-center rounded border px-2 py-1 text-xs font-medium transition-colors ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-foreground hover:bg-muted"
                      }`}
                      key={fu.value}
                      onClick={() => toggleFollowUp(fu.value)}
                      type="button"
                    >
                      {fu.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-1.5 font-medium text-muted-foreground">Remote type</div>
              <div className="flex flex-wrap gap-1.5">
                {remoteTypes.map((rt) => {
                  const selected = currentRemote === rt;
                  return (
                    <button
                      className={`inline-flex items-center rounded border px-2 py-1 text-xs font-medium transition-colors ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-foreground hover:bg-muted"
                      }`}
                      key={rt}
                      onClick={() => toggleRemote(rt)}
                      type="button"
                    >
                      {humanizeApplicationValue(rt)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-1.5 font-medium text-muted-foreground">Employment type</div>
              <div className="flex flex-wrap gap-1.5">
                {employmentTypes.map((et: EmploymentType) => {
                  const selected = currentEmployment === et;
                  return (
                    <button
                      className={`inline-flex items-center rounded border px-2 py-1 text-xs font-medium transition-colors ${
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-foreground hover:bg-muted"
                      }`}
                      key={et}
                      onClick={() => toggleEmployment(et)}
                      type="button"
                    >
                      {humanizeApplicationValue(et)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-1 font-medium text-muted-foreground">Source</div>
              <AppInput
                aria-label="Filter by source"
                onChange={(event) =>
                  updateUrl({ source: event.target.value.trim() || undefined })
                }
                placeholder="e.g. LinkedIn"
                value={currentSource}
              />
            </div>

            <div>
              <div className="mb-1 font-medium text-muted-foreground">Applied between</div>
              <div className="grid grid-cols-2 gap-2">
                <AppInput
                  aria-label="Applied from"
                  onChange={(event) =>
                    updateUrl({ appliedFrom: event.target.value || undefined })
                  }
                  type="date"
                  value={currentAppliedFrom}
                />
                <AppInput
                  aria-label="Applied to"
                  onChange={(event) =>
                    updateUrl({ appliedTo: event.target.value || undefined })
                  }
                  type="date"
                  value={currentAppliedTo}
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 pt-1 font-normal text-foreground">
              <input
                checked={currentIncludeArchived}
                className="size-4 rounded border-border text-primary focus:ring-primary"
                onChange={(e) =>
                  updateUrl({ includeArchived: e.target.checked ? "true" : undefined })
                }
                type="checkbox"
              />
              Include archived
            </label>

            <div className="flex items-center justify-between border-t border-border pt-3">
              <AppButton onClick={onClearFilters} size="sm" tone="ghost">
                Clear all
              </AppButton>
              <AppButton
                onClick={() => {
                  /* Popover automatically stays in sync with URL */
                }}
                size="sm"
              >
                Done
              </AppButton>
            </div>
          </div>
        </AppPopover>

        {/* Sort Popover */}
        <AppPopover
          align="start"
          contentClassName="w-56 p-2"
          title="Sort applications"
          trigger={
            <AppButton tone="outline">
              <span>{sortLabels[currentSort] || "Recently updated"}</span>
              <ChevronDown className="size-3.5 opacity-60" />
            </AppButton>
          }
        >
          <div className="space-y-1 text-xs">
            <div className="px-2 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
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

        {hasFilters ? (
          <AppButton className="shrink-0" onClick={onClearFilters} tone="ghost">
            <Filter /> Clear
          </AppButton>
        ) : null}

        <AppButton className="ml-auto" onClick={onCreate}>
          <Plus /> Add application
        </AppButton>
      </div>

      {/* Active Filter Chips Row */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {activeChips.map((chip) => (
            <span
              className="inline-flex items-center gap-1.5 rounded border border-border bg-card px-2.5 py-1 text-xs text-foreground shadow-xs"
              key={chip.key}
            >
              <strong className="font-medium text-muted-foreground">{chip.label}:</strong>
              <span>{chip.value}</span>
              <button
                aria-label={`Remove filter for ${chip.label}`}
                className="ml-0.5 rounded text-muted-foreground hover:bg-muted hover:text-danger"
                onClick={chip.onRemove}
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </span>
          ))}
          <button
            className="ml-1 text-xs font-medium text-primary hover:underline"
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
