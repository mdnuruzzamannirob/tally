"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, ExternalLink, Plus, RefreshCw, TrendingUp } from "lucide-react";
import { AppBadge, AppButton, AppCard, AppEmptyState, AppPageHeader, AppSkeleton, AppStatCard, AppTable, type AppTableColumn } from "@/components/app-ui";
import { useDashboardQuery } from "@/store/api/dashboard.api";
import { useAppSelector } from "@/store/hooks";
import type { DashboardSummary } from "@/types/dashboard.types";

const labels: Record<string, string> = { WISHLIST: "Wishlist", APPLIED: "Applied", SCREENING: "Screening", INTERVIEW: "Interview", OFFER: "Offer", REJECTED: "Rejected", WITHDRAWN: "Withdrawn" };
const colors: Record<string, string> = { WISHLIST: "#64748b", APPLIED: "#4f46e5", SCREENING: "#0891b2", INTERVIEW: "#7c3aed", OFFER: "#16a34a", REJECTED: "#dc2626", WITHDRAWN: "#94a3b8" };
const tones: Record<string, "neutral" | "info" | "success" | "warning" | "danger"> = { WISHLIST: "neutral", APPLIED: "info", SCREENING: "info", INTERVIEW: "warning", OFFER: "success", REJECTED: "danger", WITHDRAWN: "neutral" };
const humanize = (value: string) => value.split("_").map((part) => part.charAt(0) + part.slice(1).toLowerCase()).join(" ");
const formatDate = (value: string) => new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
const relative = (value: string) => { const days = Math.round((Date.now() - new Date(value).getTime()) / 86400000); return days <= 0 ? "Today" : days === 1 ? "Yesterday" : `${days}d ago`; };

function StatusChart({ counts }: { counts: DashboardSummary["statusCounts"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const entries = useMemo(() => Object.entries(counts).filter(([, count]) => count > 0), [counts]);
  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current);
    chart.setOption({ animationDuration: 500, tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" }, series: [{ type: "pie", radius: ["54%", "78%"], center: ["50%", "50%"], label: { show: false }, itemStyle: { borderColor: "#fff", borderWidth: 3 }, data: entries.map(([name, value]) => ({ name: labels[name] ?? humanize(name), value, itemStyle: { color: colors[name] ?? "#64748b" } })) }] });
    const resize = () => chart.resize();
    window.addEventListener("resize", resize);
    return () => { window.removeEventListener("resize", resize); chart.dispose(); };
  }, [entries]);
  return <div ref={ref} className="h-64 w-full" aria-label="Application status distribution" />;
}

export function DashboardScreen() {
  const { data, isLoading, isError, refetch } = useDashboardQuery();
  const user = useAppSelector((state) => state.auth.user);
  if (isLoading) return <div className="space-y-6"><AppSkeleton className="h-14 w-72" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <AppSkeleton className="h-32" key={item} />)}</div><div className="grid gap-5 xl:grid-cols-2"><AppSkeleton className="h-96" /><AppSkeleton className="h-96" /></div></div>;
  if (isError || !data) return <AppCard><AppEmptyState description="We couldn't load your dashboard data." icon={<TrendingUp />} title="Dashboard unavailable" action={<AppButton onClick={() => void refetch()}><RefreshCw /> Try again</AppButton>} /></AppCard>;
  const followUps = [...data.followUps.overdue.map((item) => ({ ...item, due: "Overdue", danger: true })), ...data.followUps.today.map((item) => ({ ...item, due: "Due today", danger: false }))].slice(0, 5);
  const recentColumns: readonly AppTableColumn<DashboardSummary["recentApplications"][number]>[] = [
    { key: "company", header: "Company", render: (item) => <Link className="font-medium hover:text-primary" href={`/applications/${item.id}`}>{item.company}</Link> },
    { key: "role", header: "Role", render: (item) => <span className="text-muted-foreground">{item.role}</span> },
    { key: "status", header: "Status", render: (item) => <AppBadge status={tones[item.status]}>{labels[item.status] ?? humanize(item.status)}</AppBadge> },
    { key: "updated", header: "Updated", render: (item) => <span className="text-muted-foreground">{relative(item.updatedAt)}</span> },
    { key: "open", header: "", align: "right", render: (item) => <Link aria-label={`Open ${item.company}`} href={`/applications/${item.id}`}><ArrowUpRight className="size-4 text-muted-foreground" /></Link> },
  ];
  return <section className="space-y-6">
    <AppPageHeader title="Dashboard" description={`Welcome back${user?.name ? `, ${user.name}` : ""}. Here's your job search at a glance.`} actions={<div className="flex gap-2"><Link href="/applications"><AppButton tone="outline">View applications</AppButton></Link><Link href="/applications"><AppButton><Plus /> Add application</AppButton></Link></div>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><AppStatCard icon={<BriefcaseBusiness />} label="Total applications" value={data.totalApplications} change="All time" /><AppStatCard icon={<TrendingUp />} label="Active applications" tone="info" value={data.activeApplications} change="In pipeline" /><AppStatCard icon={<CalendarDays />} label="Scheduled interviews" tone="warning" value={data.scheduledInterviews} change={`${data.followUps.todayCount} due today`} /><AppStatCard icon={<CheckCircle2 />} label="Offers" tone="success" value={data.offers} change="Keep going" /></div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,.75fr)]">
      <AppCard padding="none"><div className="flex items-start justify-between border-b border-border p-5"><div><h2 className="font-semibold">Follow-ups</h2><p className="mt-1 text-sm text-muted-foreground">Stay ahead of your next steps.</p></div><Link className="text-sm font-medium text-primary hover:underline" href="/applications?followUp=upcoming">View all</Link></div><div className="divide-y divide-border">{followUps.map((item) => <Link className="flex items-center gap-3 px-5 py-4 hover:bg-muted/40" href={`/applications/${item.id}`} key={`${item.id}-${item.due}`}><span className={`size-2 shrink-0 rounded-full ${item.danger ? "bg-danger" : "bg-warning"}`} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{item.company}</span><span className="block truncate text-xs text-muted-foreground">{item.role} · {labels[item.status] ?? humanize(item.status)}</span></span><span className={`text-xs font-medium ${item.danger ? "text-danger" : "text-warning"}`}>{item.due}</span></Link>)}{!followUps.length ? <AppEmptyState className="py-8" description="You're all caught up." icon={<CheckCircle2 />} title="No follow-ups" /> : null}</div></AppCard>
      <AppCard padding="none"><div className="flex items-start justify-between border-b border-border p-5"><div><h2 className="font-semibold">Status distribution</h2><p className="mt-1 text-sm text-muted-foreground">Across {data.totalApplications} applications</p></div><span className="text-sm text-muted-foreground">All time</span></div><div className="grid items-center gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_9rem]"><StatusChart counts={data.statusCounts} /><div className="space-y-2">{Object.entries(data.statusCounts).map(([status, count]) => <div className="flex items-center justify-between gap-3 text-xs" key={status}><span className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2 rounded-full" style={{ backgroundColor: colors[status] }} />{labels[status] ?? humanize(status)}</span><span className="font-semibold">{count}</span></div>)}</div></div></AppCard>
    </div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,.7fr)]"><AppCard padding="none"><div className="flex items-start justify-between border-b border-border p-5"><div><h2 className="font-semibold">Recent applications</h2><p className="mt-1 text-sm text-muted-foreground">Your latest activity</p></div><Link className="text-sm font-medium text-primary hover:underline" href="/applications">View all</Link></div><AppTable columns={recentColumns} getRowKey={(item) => item.id} rows={data.recentApplications} empty="No applications yet. Add your first application to get started." /></AppCard><AppCard padding="none"><div className="flex items-start justify-between border-b border-border p-5"><div><h2 className="font-semibold">Upcoming interviews</h2><p className="mt-1 text-sm text-muted-foreground">Your next scheduled conversations</p></div><Link className="text-sm font-medium text-primary hover:underline" href="/interviews">View all</Link></div><div className="divide-y divide-border">{data.upcomingInterviews.map((item) => <Link className="flex gap-3 p-5 hover:bg-muted/40" href={`/applications/${item.application.id}`} key={item.id}><span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary/10 text-center text-primary"><span className="text-sm font-semibold leading-none">{new Date(item.scheduledAt).getDate()}</span><span className="mt-1 text-[9px] uppercase">{new Date(item.scheduledAt).toLocaleString(undefined, { month: "short" })}</span></span><span className="min-w-0"><span className="block truncate text-sm font-semibold">{item.application.company} · {item.application.role}</span><span className="mt-1 block text-xs text-muted-foreground">{formatDate(item.scheduledAt)} · {humanize(item.type)}</span><span className="mt-2 inline-flex items-center gap-1 text-xs text-primary">{item.status === "SCHEDULED" ? "Scheduled" : humanize(item.status)} <ExternalLink className="size-3" /></span></span></Link>)}{!data.upcomingInterviews.length ? <AppEmptyState className="py-8" description="Scheduled interviews will appear here." icon={<Clock3 />} title="No upcoming interviews" /> : null}</div></AppCard></div>
  </section>;
}
