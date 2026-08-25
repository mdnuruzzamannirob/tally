import Link from "next/link";
import { CalendarClock, ChevronRight } from "lucide-react";
import { AppBadge, AppCard, AppPagination, AppSelect, AppTable } from "@/components/app-ui";
import type { Application } from "@/types/application.types";
import { humanizeApplicationValue } from "../application-config";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";

type ApplicationTableProps = {
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: string) => void;
  page: number;
  pageSize: number;
  rows: Application[];
  total: number;
  totalPages: number;
};

export function ApplicationTable({ onPageChange, onPageSizeChange, page, pageSize, rows, total, totalPages }: ApplicationTableProps) {
  return <AppCard className="overflow-hidden shadow-sm" padding="none">
    <AppTable columns={[{ key: "company", header: "Company & role", render: (row: Application) => <Link className="group block" href={`/applications/${row.id}`}><span className="block font-medium group-hover:text-primary">{row.company}</span><span className="block text-xs text-muted-foreground">{row.role}</span></Link> }, { key: "status", header: "Status", render: (row) => <ApplicationStatusBadge status={row.status} /> }, { key: "tags", header: "Tags", render: (row) => row.tags.length ? <div className="flex max-w-48 flex-wrap gap-1.5">{row.tags.slice(0, 3).map((tag) => <AppBadge key={tag.id} size="sm">{tag.name}</AppBadge>)}</div> : <span className="text-muted-foreground">—</span> }, { key: "details", header: "Details", render: (row) => <span className="text-muted-foreground">{[row.location, row.remoteType ? humanizeApplicationValue(row.remoteType) : ""].filter(Boolean).join(" · ") || "—"}</span> }, { key: "followup", header: "Follow-up", render: (row) => row.nextFollowUpAt ? <span className="inline-flex items-center gap-1 text-warning"><CalendarClock className="size-3.5" />{new Date(row.nextFollowUpAt).toLocaleDateString()}</span> : <span className="text-muted-foreground">—</span> }, { key: "open", header: <span className="sr-only">Open application</span>, align: "right", render: (row) => <Link aria-label={`Open ${row.company}`} className="inline-flex text-muted-foreground hover:text-primary" href={`/applications/${row.id}`}><ChevronRight className="size-4" /></Link> }]} getRowKey={(row) => row.id} rows={rows} />
    <div className="flex flex-col gap-3 border-t border-border bg-muted/20 px-5 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total} applications</p><div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">Rows per page</span><AppSelect ariaLabel="Rows per page" onValueChange={(value) => onPageSizeChange(value || "20")} options={[{ label: "10", value: "10" }, { label: "20", value: "20" }, { label: "50", value: "50" }]} size="sm" triggerClassName="w-18" value={String(pageSize)} /><AppPagination onPageChange={onPageChange} page={page} totalPages={Math.max(1, totalPages)} /></div></div>
  </AppCard>;
}
