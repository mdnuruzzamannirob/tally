"use client";

import Link from "next/link";
import { AlertTriangle, CalendarClock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { AppBadge, AppCard, AppDropdownMenu, AppPagination, AppSelect, AppTable } from "@/components/app-ui";
import type { Application, ApplicationStatus } from "@/types/application.types";
import { applicationLabels, applicationStatuses, humanizeApplicationValue } from "../application-config";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

type ApplicationTableProps = {
  onArchive?: (application: Application) => void;
  onDelete?: (application: Application) => void;
  onEdit?: (application: Application) => void;
  onMove?: (id: string, status: ApplicationStatus) => Promise<boolean>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: string) => void;
  page: number;
  pageSize: number;
  rows: Application[];
  total: number;
  totalPages: number;
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const relative = (value: string) => {
  const diffMinutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.round(diffDays / 7)}w ago`;
};

export function ApplicationTable({
  onArchive,
  onDelete,
  onEdit,
  onMove,
  onPageChange,
  onPageSizeChange,
  page,
  pageSize,
  rows,
  total,
  totalPages,
}: ApplicationTableProps) {
  return (
    <AppCard className="overflow-hidden shadow-sm" padding="none">
      <AppTable
        columns={[
          {
            key: "company",
            header: "Company / Role",
            render: (row: Application) => (
              <Link className="group block" href={`/applications/${row.id}`}>
                <div className="flex items-center gap-1.5 font-medium group-hover:text-primary">
                  <span>{row.company}</span>
                  {row.archivedAt && (
                    <AppBadge size="sm" status="neutral">
                      Archived
                    </AppBadge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{row.role}</div>
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
            render: (row) =>
              row.tags.length ? (
                <div className="flex max-w-44 flex-wrap gap-1">
                  {row.tags.slice(0, 3).map((tag) => (
                    <span
                      className="inline-flex items-center gap-1 rounded border border-border bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-foreground"
                      key={tag.id}
                    >
                      <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: tag.color || "var(--primary)" }}
                      />
                      {tag.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground">—</span>
              ),
          },
          {
            key: "appliedAt",
            header: "Applied",
            render: (row) => (
              <span className="text-xs text-muted-foreground">{formatDate(row.appliedAt)}</span>
            ),
          },
          {
            key: "followup",
            header: "Follow-up",
            render: (row) => {
              if (!row.nextFollowUpAt) return <span className="text-muted-foreground">—</span>;
              const fuDate = new Date(row.nextFollowUpAt);
              const isOverdue = fuDate < new Date();
              const isToday = fuDate.toDateString() === new Date().toDateString();

              return (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium ${
                    isOverdue ? "text-danger" : isToday ? "text-warning" : "text-muted-foreground"
                  }`}
                >
                  {isOverdue ? (
                    <AlertTriangle className="size-3.5" />
                  ) : (
                    <CalendarClock className="size-3.5" />
                  )}
                  {isOverdue
                    ? `Overdue · ${formatDate(row.nextFollowUpAt)}`
                    : isToday
                      ? "Due today"
                      : formatDate(row.nextFollowUpAt)}
                </span>
              );
            },
          },
          {
            key: "updatedAt",
            header: "Updated",
            render: (row) => (
              <span className="text-xs text-muted-foreground">{relative(row.updatedAt)}</span>
            ),
          },
          {
            key: "actions",
            header: <span className="sr-only">Actions</span>,
            align: "right",
            render: (row) => (
              <div
                className="flex justify-end"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <AppDropdownMenu
                  items={[
                    ...applicationStatuses
                      .filter((st) => st !== row.status)
                      .map((targetStatus) => ({
                        label: `Change status to ${applicationLabels[targetStatus]}`,
                        onSelect: () => onMove?.(row.id, targetStatus),
                      })),
                    ...(onEdit
                      ? [
                          {
                            label: "Edit details",
                            icon: <Pencil className="size-3.5" />,
                            onSelect: () => onEdit(row),
                            separatorBefore: true,
                          },
                        ]
                      : []),
                    ...(onArchive
                      ? [
                          {
                            label: row.archivedAt ? "Unarchive" : "Archive",
                            onSelect: () => onArchive(row),
                          },
                        ]
                      : []),
                    ...(onDelete
                      ? [
                          {
                            label: "Delete",
                            icon: <Trash2 className="size-3.5" />,
                            variant: "destructive" as const,
                            separatorBefore: true,
                            onSelect: () => onDelete(row),
                          },
                        ]
                      : []),
                  ]}
                  trigger={
                    <button
                      aria-label={`Actions for ${row.company}`}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      type="button"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  }
                />
              </div>
            ),
          },
        ]}
        getRowKey={(row) => row.id}
        rows={rows}
      />
      <div className="flex flex-col gap-3 border-t border-border bg-muted/20 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground sm:text-sm">
          Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of{" "}
          {total} applications
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Rows per page</span>
          <AppSelect
            ariaLabel="Rows per page"
            onValueChange={(value) => onPageSizeChange(value || "20")}
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
            onPageChange={onPageChange}
            page={page}
            totalPages={Math.max(1, totalPages)}
          />
        </div>
      </div>
    </AppCard>
  );
}
