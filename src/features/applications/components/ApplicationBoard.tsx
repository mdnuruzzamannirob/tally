"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type DragEvent } from "react";
import { Archive, ArrowRightLeft, CalendarClock, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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

  const scrollBoard = (direction: -1 | 1) =>
    boardRef.current?.scrollBy({ left: direction * 480, behavior: "smooth" });

  const autoScroll = (event: DragEvent<HTMLDivElement>) => {
    const bounds = boardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    if (event.clientX - bounds.left < 96) boardRef.current?.scrollBy({ left: -28 });
    if (bounds.right - event.clientX < 96) boardRef.current?.scrollBy({ left: 28 });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground sm:text-sm">
          Drag cards between columns to change status — every card also has an accessible status menu.
        </p>
        <div className="flex gap-1">
          <AppButton
            aria-label="Scroll board left"
            onClick={() => scrollBoard(-1)}
            size="icon-sm"
            tone="outline"
          >
            <ChevronLeft />
          </AppButton>
          <AppButton
            aria-label="Scroll board right"
            onClick={() => scrollBoard(1)}
            size="icon-sm"
            tone="outline"
          >
            <ChevronRight />
          </AppButton>
        </div>
      </div>
      <div
        className="flex gap-3 overflow-x-auto pb-3 [scrollbar-width:thin]"
        onDragOver={autoScroll}
        ref={boardRef}
      >
        {applicationStatuses.map((status) => {
          const cards = boardRows.filter((row) => row.status === status);
          return (
            <div
              className={`w-[230px] shrink-0 rounded-lg border bg-surface-muted/90 p-2.5 transition-colors ${
                dragOverStatus === status
                  ? "border-primary bg-primary/10"
                  : "border-border"
              }`}
              key={status}
              onDragEnter={() => setDragOverStatus(status)}
              onDragLeave={() => setDragOverStatus(null)}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
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
                                    onSelect: () => onDelete(row),
                                  },
                                ]
                              : []),
                          ]}
                          trigger={
                            <button
                              aria-label={`Actions for ${row.company}`}
                              className="rounded p-0.5 text-muted-foreground opacity-60 hover:bg-muted hover:opacity-100 focus:opacity-100"
                              type="button"
                            >
                              <MoreHorizontal className="size-3.5" />
                            </button>
                          }
                        />
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{row.role}</div>

                      {/* Follow-up date matching screenshot format */}
                      {fuDate && (
                        <div
                          className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
                            isOverdue
                              ? "text-danger"
                              : isToday
                                ? "text-warning"
                                : "text-muted-foreground"
                          }`}
                        >
                          {isOverdue ? (
                            <span>⚠️ {fuDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                          ) : isToday ? (
                            <span>🕒 Today</span>
                          ) : (
                            <span>{fuDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {!cards.length ? (
                  <div className="p-2 text-xs text-muted-foreground">
                    No items
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
