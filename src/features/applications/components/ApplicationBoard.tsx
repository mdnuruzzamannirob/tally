"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type DragEvent } from "react";
import {
  Archive,
  ArrowRightLeft,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { AppBadge, AppButton, AppDropdownMenu } from "@/components/app-ui";
import type { Application, ApplicationStatus } from "@/types/application.types";
import { applicationLabels, applicationStatuses } from "../application-config";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

export function ApplicationBoard({
  rows,
  onMove,
  onEdit,
  onArchive,
  onDelete,
}: {
  rows: Application[];
  onMove: (id: string, status: ApplicationStatus) => Promise<boolean>;
  onEdit?: (application: Application) => void;
  onArchive?: (application: Application) => void;
  onDelete?: (application: Application) => void;
}) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<ApplicationStatus | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ApplicationStatus>>({});
  const boardRef = useRef<HTMLDivElement>(null);

  const boardRows = useMemo(
    () =>
      rows.map((row) =>
        statusOverrides[row.id] ? { ...row, status: statusOverrides[row.id] } : row,
      ),
    [rows, statusOverrides],
  );

  const dropApplication = async (id: string, status: ApplicationStatus) => {
    const application = boardRows.find((row) => row.id === id);
    if (!application || application.status === status) return;
    const previousStatus = application.status;
    setStatusOverrides((current) => ({ ...current, [id]: status }));
    if (!(await onMove(id, status))) {
      setStatusOverrides((current) => ({ ...current, [id]: previousStatus }));
    }
  };

  const [isPanning, setIsPanning] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const autoScroll = (event: DragEvent<HTMLDivElement>) => {
    const bounds = boardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    if (event.clientX - bounds.left < 96) boardRef.current?.scrollBy({ left: -28 });
    if (bounds.right - event.clientX < 96) boardRef.current?.scrollBy({ left: 28 });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only pan if clicking outside of draggable cards and buttons
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest("[draggable='true']")) {
      return;
    }
    setIsPanning(true);
    setStartX(e.pageX - (boardRef.current?.offsetLeft || 0));
    setScrollLeft(boardRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !boardRef.current) return;
    e.preventDefault();
    const x = e.pageX - (boardRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    boardRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  return (
    <div className="space-y-3">
      <div
        className={`flex gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
          isPanning ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
        onDragOver={autoScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        ref={boardRef}
      >
        {applicationStatuses.map((status) => {
          const cards = boardRows.filter((row) => row.status === status);
          const isTargetDrop = dragOverStatus === status && Boolean(draggedId);

          return (
            <div
              className={`w-[230px] shrink-0 rounded-lg border p-2.5 transition-all ${
                isTargetDrop
                  ? "border-primary bg-primary-soft ring-2 ring-primary/40 shadow-sm"
                  : "border-border bg-surface-muted/90"
              }`}
              key={status}
              onDragEnter={(event) => {
                event.preventDefault();
                setDragOverStatus(status);
              }}
              onDragLeave={(event) => {
                // Only clear if leaving the column itself, not entering a child card
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  setDragOverStatus((current) => (current === status ? null : current));
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                if (dragOverStatus !== status) {
                  setDragOverStatus(status);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                const id = event.dataTransfer.getData("application-id") || draggedId;
                if (id) void dropApplication(id, status);
                setDraggedId(null);
                setDragOverStatus(null);
              }}
            >
              {/* Header with status badge and count pill matching prototype .board-col-head */}
              <div className="flex items-center gap-2 pb-2.5 pt-0.5 px-0.5">
                <ApplicationStatusBadge status={status} />
                <span className="text-xs font-semibold text-muted-foreground ml-0.5">
                  {cards.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="min-h-44 space-y-2">
                {cards.map((row) => {
                  const fuDate = row.nextFollowUpAt ? new Date(row.nextFollowUpAt) : null;
                  const isOverdue = fuDate ? fuDate < new Date() : false;
                  const isToday = fuDate
                    ? fuDate.toDateString() === new Date().toDateString()
                    : false;

                  return (
                    <div
                      className={`group relative rounded-lg border border-border bg-surface p-3 shadow-2xs transition-all hover:border-card-hover-bd cursor-grab active:cursor-grabbing ${
                        draggedId === row.id ? "opacity-75 border-primary" : ""
                      }`}
                      draggable
                      key={row.id}
                      onDragEnd={() => {
                        setDraggedId(null);
                        setDragOverStatus(null);
                      }}
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("application-id", row.id);
                        setDraggedId(row.id);
                      }}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <Link
                          className="font-semibold text-sm text-foreground hover:underline line-clamp-1"
                          href={`/applications/${row.id}`}
                        >
                          {row.company}
                        </Link>
                        <AppDropdownMenu
                          items={[
                            {
                              label: "Change status",
                              icon: <ArrowRightLeft className="size-3.5" />,
                              onSelect: () => {
                                void onMove(row.id, row.status);
                              },
                            },
                            ...(onEdit
                              ? [
                                  {
                                    label: "Edit",
                                    icon: <Pencil className="size-3.5" />,
                                    onSelect: () => onEdit(row),
                                  },
                                ]
                              : []),
                            ...(onArchive
                              ? [
                                  {
                                    label: row.archivedAt ? "Unarchive" : "Archive",
                                    icon: <Archive className="size-3.5" />,
                                    onSelect: () => onArchive(row),
                                  },
                                ]
                              : []),
                            ...(onDelete
                              ? [
                                  {
                                    label: "Delete",
                                    icon: <Trash2 className="size-3.5 text-danger" />,
                                    separatorBefore: true,
                                    variant: "destructive" as const,
                                    onSelect: () => onDelete(row),
                                  },
                                ]
                              : []),
                          ]}
                          trigger={
                            <button
                              aria-label={`Actions for ${row.company}`}
                              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              onClick={(event) => event.stopPropagation()}
                              type="button"
                            >
                              <MoreHorizontal className="size-4" />
                            </button>
                          }
                        />
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {row.role}
                      </div>
                      {row.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {row.tags.slice(0, 3).map((tag) => (
                            <span
                              className="inline-flex items-center gap-1 rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground"
                              key={tag.id}
                            >
                              <span
                                className="size-1.5 shrink-0 rounded-full"
                                style={{ backgroundColor: tag.color || "var(--primary)" }}
                              />
                              <span className="max-w-24 truncate">{tag.name}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 space-y-2 border-t border-border pt-2.5">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
                            Applied
                          </p>
                          <p className="mt-0.5 text-[10px] font-medium tabular-nums text-foreground">
                            {row.appliedAt
                              ? new Date(row.appliedAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "—"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
                            Updated
                          </p>
                          <p className="mt-0.5 text-[10px] font-medium tabular-nums text-foreground">
                            {new Date(row.updatedAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Follow-up date matching screenshot format */}
                      {fuDate && (
                        <div
                          className={`mt-2 flex items-center justify-between gap-3 text-xs font-medium ${
                            isOverdue
                              ? "text-danger-text"
                              : isToday
                                ? "text-warning-text"
                                : "text-muted-foreground"
                          }`}
                        >
                          <span className="text-[10px] font-medium uppercase tracking-wide opacity-75">Follow-up</span>
                          {isOverdue ? (
                            <span className="ml-auto text-[10px] font-semibold tabular-nums">
                              ⚠️{" "}
                              {fuDate.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          ) : isToday ? (
                            <span className="ml-auto text-[10px] font-semibold tabular-nums">Today</span>
                          ) : (
                            <span className="ml-auto text-[10px] font-semibold tabular-nums">
                              {fuDate.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {!cards.length ? (
                  <div className="p-2 text-xs text-muted-foreground">No items</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
