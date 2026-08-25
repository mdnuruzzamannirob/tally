"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type DragEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppBadge, AppButton } from "@/components/app-ui";
import type { Application, ApplicationStatus } from "@/types/application.types";
import { applicationLabels, applicationStatuses, boardAccents, humanizeApplicationValue } from "../application-config";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

export function ApplicationBoard({ rows, onMove }: { rows: Application[]; onMove: (id: string, status: ApplicationStatus) => Promise<boolean> }) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<ApplicationStatus | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ApplicationStatus>>({});
  const boardRef = useRef<HTMLDivElement>(null);
  const boardRows = useMemo(() => rows.map((row) => statusOverrides[row.id] ? { ...row, status: statusOverrides[row.id] } : row), [rows, statusOverrides]);
  const dropApplication = async (id: string, status: ApplicationStatus) => {
    const application = boardRows.find((row) => row.id === id);
    if (!application || application.status === status) return;
    const previousStatus = application.status;
    setStatusOverrides((current) => ({ ...current, [id]: status }));
    if (!await onMove(id, status)) setStatusOverrides((current) => ({ ...current, [id]: previousStatus }));
  };
  const scrollBoard = (direction: -1 | 1) => boardRef.current?.scrollBy({ left: direction * 480, behavior: "smooth" });
  const autoScroll = (event: DragEvent<HTMLDivElement>) => {
    const bounds = boardRef.current?.getBoundingClientRect();
    if (!bounds) return;
    if (event.clientX - bounds.left < 96) boardRef.current?.scrollBy({ left: -28 });
    if (bounds.right - event.clientX < 96) boardRef.current?.scrollBy({ left: 28 });
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Drag an application to update its stage.</p><div className="flex gap-1"><AppButton aria-label="Scroll board left" onClick={() => scrollBoard(-1)} size="icon-sm" tone="outline"><ChevronLeft /></AppButton><AppButton aria-label="Scroll board right" onClick={() => scrollBoard(1)} size="icon-sm" tone="outline"><ChevronRight /></AppButton></div></div>
      <div className="flex gap-3 overflow-x-auto pb-3 [scrollbar-width:thin]" onDragOver={autoScroll} ref={boardRef}>
        {applicationStatuses.map((status) => <div className={`w-52 shrink-0 rounded-xl border bg-muted/30 transition-colors ${dragOverStatus === status ? "border-primary bg-primary/5 shadow-sm" : "border-border"}`} key={status} onDragEnter={() => setDragOverStatus(status)} onDragLeave={() => setDragOverStatus(null)} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }} onDrop={(event) => { event.preventDefault(); const id = event.dataTransfer.getData("application-id") || draggedId; if (id) void dropApplication(id, status); setDraggedId(null); setDragOverStatus(null); }}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3"><span className="flex items-center gap-2 text-sm font-semibold"><span className={`size-2 rounded-full ${boardAccents[status]}`} />{applicationLabels[status]}</span><span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground">{boardRows.filter((row) => row.status === status).length}</span></div>
          <div className="min-h-44 space-y-2 p-2">{boardRows.filter((row) => row.status === status).map((row) => <Link className="block cursor-grab rounded-lg border border-border bg-card p-3 shadow-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md active:cursor-grabbing" draggable onDragEnd={() => { setDraggedId(null); setDragOverStatus(null); }} onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("application-id", row.id); setDraggedId(row.id); }} href={`/applications/${row.id}`} key={row.id}><div className="flex items-start justify-between gap-2"><span className="text-sm font-semibold">{row.company}</span><ChevronRight className="size-4 shrink-0 text-muted-foreground" /></div><p className="mt-1 text-sm text-muted-foreground">{row.role}</p><div className="mt-3 flex flex-wrap gap-1.5"><ApplicationStatusBadge status={row.status} />{row.remoteType ? <AppBadge>{humanizeApplicationValue(row.remoteType)}</AppBadge> : null}</div>{row.nextFollowUpAt ? <p className="mt-3 text-xs text-warning">Follow-up {new Date(row.nextFollowUpAt).toLocaleDateString()}</p> : null}</Link>)}{!boardRows.some((row) => row.status === status) ? <div className={`flex min-h-36 items-center justify-center rounded-lg border border-dashed text-center text-xs text-muted-foreground ${dragOverStatus === status ? "border-primary text-primary" : "border-border/70"}`}>{draggedId ? "Drop application here" : "No applications"}</div> : null}</div>
        </div>)}
      </div>
    </div>
  );
}
