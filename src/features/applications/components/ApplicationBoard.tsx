"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type DragEvent } from "react";
import { AlertTriangle, CalendarClock, ChevronLeft, ChevronRight, Clock, MoreHorizontal, Pencil } from "lucide-react";
import { AppBadge, AppButton, AppDropdownMenu } from "@/components/app-ui";
import type { Application, ApplicationStatus } from "@/types/application.types";
import { applicationLabels, applicationStatuses, boardAccents, humanizeApplicationValue } from "../application-config";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

export function ApplicationBoard({
  rows,
  onMove,
  onEdit,
}: {
  rows: Application[];
  onMove: (id: string, status: ApplicationStatus) => Promise<boolean>;
  onEdit?: (application: Application) => void;
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
              className={`w-64 shrink-0 rounded-xl border bg-muted/30 p-2 transition-colors ${
                dragOverStatus === status
                  ? "border-primary bg-primary/5 shadow-sm"
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
              <div className="flex items-center justify-between border-b border-border px-2 py-2 mb-2">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className={`size-2 rounded-full ${boardAccents[status]}`} />
                  {applicationLabels[status]}
                </span>
                <span className="rounded bg-background border border-border px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {cards.length}
                </span>
              </div>
              <div className="min-h-44 space-y-2">
                {cards.map((row) => {
                  const fuDate = row.nextFollowUpAt ? new Date(row.nextFollowUpAt) : null;
                  const isOverdue = fuDate ? fuDate < new Date() : false;
                  const isToday = fuDate
                    ? fuDate.toDateString() === new Date().toDateString()
                    : false;

                  return (
                    <div
                      className="group relative block rounded-lg border border-border bg-card p-3 shadow-xs transition-[border-color,box-shadow,transform] hover:border-primary/50 hover:shadow-sm"
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
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          className="font-medium text-sm hover:text-primary focus:outline-hidden"
                          href={`/applications/${row.id}`}
                        >
                          {row.company}
                        </Link>
                        <AppDropdownMenu
                          items={[
                            ...applicationStatuses
                              .filter((st) => st !== row.status)
                              .map((targetStatus) => ({
                                label: `Move to ${applicationLabels[targetStatus]}`,
                                onSelect: () => void dropApplication(row.id, targetStatus),
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
                          ]}
                          trigger={
                            <button
                              aria-label={`Actions for ${row.company}`}
                              className="rounded p-1 text-muted-foreground opacity-60 hover:bg-muted hover:opacity-100 focus:opacity-100"
                              type="button"
                            >
                              <MoreHorizontal className="size-4" />
                            </button>
                          }
                        />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{row.role}</p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        {row.tags.slice(0, 2).map((tag) => (
                          <AppBadge key={tag.id} size="sm">
                            {tag.name}
                          </AppBadge>
                        ))}
                        {row.remoteType ? (
                          <span className="text-[11px] text-muted-foreground">
                            {humanizeApplicationValue(row.remoteType)}
                          </span>
                        ) : null}
                      </div>

                      {fuDate ? (
                        <div
                          className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                            isOverdue
                              ? "text-danger"
                              : isToday
                                ? "text-warning"
                                : "text-muted-foreground"
                          }`}
                        >
                          {isOverdue ? (
                            <AlertTriangle className="size-3" />
                          ) : (
                            <CalendarClock className="size-3" />
                          )}
                          <span>
                            {isOverdue
                              ? `Overdue · ${fuDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                              : isToday
                                ? "Due today"
                                : fuDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                {!cards.length ? (
                  <div
                    className={`flex min-h-32 items-center justify-center rounded-lg border border-dashed text-center text-xs text-muted-foreground ${
                      dragOverStatus === status
                        ? "border-primary text-primary"
                        : "border-border/70"
                    }`}
                  >
                    {draggedId ? "Drop application here" : "No items"}
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
