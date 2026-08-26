"use client";

import {
  AppBadge,
  AppButton,
  AppCard,
  AppEmptyState,
  AppPageHeader,
  AppSkeleton,
  toast,
} from "@/components/app-ui";
import { useDashboardQuery } from "@/store/api/dashboard.api";
import { useAppSelector } from "@/store/hooks";
import type { DashboardSummary } from "@/types/dashboard.types";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  Clock3,
  Phone,
  Plus,
  RefreshCw,
  TrendingUp,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useEffect } from "react";

const statusLabels: Record<string, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const statusColors: Record<string, string> = {
  WISHLIST: "#64748b",
  APPLIED: "#4f46e5",
  SCREENING: "#0891b2",
  INTERVIEW: "#7c3aed",
  OFFER: "#16a34a",
  REJECTED: "#dc2626",
  WITHDRAWN: "#94a3b8",
};

const statusTones: Record<string, "neutral" | "info" | "success" | "warning" | "danger"> = {
  WISHLIST: "neutral",
  APPLIED: "info",
  SCREENING: "info",
  INTERVIEW: "warning",
  OFFER: "success",
  REJECTED: "danger",
  WITHDRAWN: "neutral",
};

const humanize = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");

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

const fmtDate = (v: string) =>
  new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const fmtTime = (v: string) =>
  new Date(v).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

// Interview type icons
function IvTypeIcon({ type }: { type: string }) {
  if (type === "PHONE") return <Phone className="size-4" />;
  if (type === "HR") return <Phone className="size-4" />;
  return <Video className="size-4" />;
}

// SVG donut chart matching prototype
function DonutChart({ counts }: { counts: DashboardSummary["statusCounts"] }) {
  const total = Object.values(counts).reduce((sum, c) => sum + c, 0);
  const statuses = Object.keys(statusLabels);

  const segs = useMemo(() => {
    if (!total) return [];
    let offset = 0;
    return statuses
      .filter((s) => (counts[s] ?? 0) > 0)
      .map((s) => {
        const pct = ((counts[s] ?? 0) / total) * 100;
        const seg = { status: s, pct, offset };
        offset += pct;
        return seg;
      });
  }, [counts, total, statuses]);

  return (
    <svg
      aria-label="Status distribution chart"
      className="h-[150px] w-[150px] shrink-0"
      role="img"
      viewBox="0 0 100 100"
    >
      <g transform="rotate(-90 50 50)">
        <circle
          cx="50"
          cy="50"
          fill="none"
          r="40"
          stroke="var(--muted)"
          strokeWidth="13"
        />
        {segs.map((seg) => (
          <circle
            cx="50"
            cy="50"
            fill="none"
            key={seg.status}
            pathLength="100"
            r="40"
            stroke={statusColors[seg.status] ?? "#94a3b8"}
            strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
            strokeDashoffset={-seg.offset}
            strokeWidth="13"
          />
        ))}
      </g>
    </svg>
  );
}

// Prototype stat card design
function StatCard({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  href?: string;
}) {
  const inner = (
    <div className="flex w-full flex-col p-4">
      {/* Icon — primary-subtle bg, primary text, 32px */}
      <div className="mb-2.5 flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary [&>svg]:size-4">
        {icon}
      </div>
      <div className="text-[13px] text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-semibold leading-none tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );

  if (href)
    return (
      <Link
        className="group block rounded-lg border border-border bg-card transition-colors hover:border-primary/40 hover:bg-muted/30"
        href={href}
      >
        {inner}
      </Link>
    );

  return (
    <div className="rounded-lg border border-border bg-card transition-colors hover:border-primary/40 hover:bg-muted/30 cursor-pointer">
      {inner}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <AppSkeleton className="h-14 w-full max-w-lg" />
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <AppSkeleton className="h-28" key={i} />
        ))}
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <AppSkeleton className="h-72" />
        <AppSkeleton className="h-72" />
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <AppSkeleton className="h-72" />
        <AppSkeleton className="h-72" />
      </div>
    </div>
  );
}

export function DashboardScreen() {
  const { data, isLoading, isError, refetch } = useDashboardQuery();
  const user = useAppSelector((state) => state.auth.user);

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data)
    return (
      <AppCard>
        <AppEmptyState
          description="We couldn't load your dashboard data. Check your connection and try again."
          icon={<TrendingUp />}
          title="Dashboard unavailable"
          action={
            <AppButton onClick={() => void refetch()}>
              <RefreshCw /> Try again
            </AppButton>
          }
        />
      </AppCard>
    );

  const followUps = [
    ...data.followUps.overdue.map((item) => ({ ...item, kind: "overdue" as const })),
    ...data.followUps.today.map((item) => ({ ...item, kind: "today" as const })),
  ].slice(0, 6);

  const statusKeys = Object.keys(statusLabels);
  const totalApps = data.totalApplications;

  return (
    <section className="min-w-0 space-y-5">
      {/* Page Head */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Your job search at a glance — archived applications excluded.
          </p>
        </div>
      </div>

      {/* Empty / onboarding */}
      {data.totalApplications === 0 ? (
        <AppCard>
          <AppEmptyState
            description="Track every application, interview, and follow-up in one place. Start by adding your first application."
            icon={<BriefcaseBusiness />}
            title="Welcome to Tally"
            action={
              <Link href="/applications">
                <AppButton>
                  <Plus /> Add your first application
                </AppButton>
              </Link>
            }
          />
        </AppCard>
      ) : null}

      {/* ===== STAT GRID ===== */}
      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          href="/applications"
          icon={<BriefcaseBusiness />}
          label="Total applications"
          sub="All statuses · incl. closed"
          value={data.totalApplications}
        />
        <StatCard
          href="/applications?status=APPLIED"
          icon={<Clock />}
          label="Active applications"
          sub="Applied · Screening · Interview"
          value={data.activeApplications}
        />
        <StatCard
          href="/interviews"
          icon={<CalendarDays />}
          label="Scheduled interviews"
          sub={
            data.upcomingInterviews.length
              ? `Next: ${fmtDate(data.upcomingInterviews[0].scheduledAt)}, ${fmtTime(data.upcomingInterviews[0].scheduledAt)}`
              : "None upcoming"
          }
          value={data.scheduledInterviews}
        />
        <StatCard
          href="/applications?status=OFFER"
          icon={<CheckCircle2 />}
          label="Offers"
          sub={data.offers > 0 ? "Congratulations!" : "Keep going!"}
          value={data.offers}
        />
      </div>

      {/* ===== DASH GRID ROW 1: Follow-ups + Status distribution ===== */}
      <div className="grid gap-3.5 xl:grid-cols-2">
        {/* Follow-ups */}
        <AppCard padding="none">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
            <div className="flex items-center gap-2.5">
              <h2 className="font-semibold text-sm">Follow-ups</h2>
              <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-medium">
                {followUps.length}
              </span>
            </div>
          </div>
          <div className="divide-y divide-border">
            {followUps.map((item) => (
              <Link
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 cursor-pointer"
                href={`/applications/${item.id}`}
                key={`${item.id}-${item.kind}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{item.company}</div>
                  <div className="truncate text-xs text-muted-foreground">{item.role}</div>
                </div>
                <AppBadge status={statusTones[item.status]}>
                  {statusLabels[item.status] ?? humanize(item.status)}
                </AppBadge>
                <span
                  className={`flex items-center gap-1 whitespace-nowrap text-xs font-medium ${
                    item.kind === "overdue" ? "text-danger" : "text-warning"
                  }`}
                >
                  {item.kind === "overdue" ? (
                    <AlertTriangle className="size-3.5" />
                  ) : (
                    <Clock className="size-3.5" />
                  )}
                  {item.kind === "overdue"
                    ? `Overdue · ${fmtDate(item.nextFollowUpAt ?? "")}`
                    : "Due today"}
                </span>
              </Link>
            ))}
            {!followUps.length ? (
              <AppEmptyState
                className="py-8"
                description="No follow-ups due today."
                icon={<CheckCircle2 />}
                title="You're all caught up"
              />
            ) : null}
          </div>
        </AppCard>

        {/* Status distribution */}
        <AppCard padding="none">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
            <h2 className="font-semibold text-sm">Status distribution</h2>
            <span className="text-[13px] text-muted-foreground">{totalApps} total</span>
          </div>
          <div className="flex flex-wrap items-center gap-5 p-4">
            <DonutChart counts={data.statusCounts} />
            <div className="flex flex-col gap-1.5 text-[13px] flex-1 min-w-[140px]">
              {statusKeys.map((s) => (
                <div className="flex items-center gap-2" key={s}>
                  <span
                    className="size-2 shrink-0 rounded-sm"
                    style={{ backgroundColor: statusColors[s] }}
                  />
                  <span className="flex-1 text-muted-foreground">{statusLabels[s]}</span>
                  <span className="font-medium text-foreground">
                    {data.statusCounts[s] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AppCard>
      </div>

      {/* ===== DASH GRID ROW 2: Upcoming interviews + Recent applications ===== */}
      <div className="grid gap-3.5 xl:grid-cols-2">
        {/* Upcoming interviews */}
        <AppCard padding="none">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
            <h2 className="font-semibold text-sm">Upcoming interviews</h2>
            <Link
              className="text-sm font-medium text-primary hover:underline"
              href="/interviews"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {data.upcomingInterviews.map((item) => (
              <Link
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40"
                href={`/applications/${item.application.id}`}
                key={item.id}
              >
                {/* Interview type icon */}
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <IvTypeIcon type={item.type} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {humanize(item.type)} · {item.application.company}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {item.application.role}
                  </div>
                </div>
                {/* Date + time right-aligned */}
                <div className="shrink-0 text-right">
                  <div className="text-[13px] font-medium">{fmtDate(item.scheduledAt)}</div>
                  <div className="text-xs text-muted-foreground">{fmtTime(item.scheduledAt)}</div>
                </div>
              </Link>
            ))}
            {!data.upcomingInterviews.length ? (
              <AppEmptyState
                className="py-8"
                description="Add an interview from an application."
                icon={<Clock3 />}
                title="No interviews scheduled"
              />
            ) : null}
          </div>
        </AppCard>

        {/* Recent applications */}
        <AppCard padding="none">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
            <h2 className="font-semibold text-sm">Recent applications</h2>
            <Link className="text-sm font-medium text-primary hover:underline" href="/applications">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {data.recentApplications.map((item) => (
              <Link
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40"
                href={`/applications/${item.id}`}
                key={item.id}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{item.company}</div>
                  <div className="truncate text-xs text-muted-foreground">{item.role}</div>
                </div>
                <AppBadge status={statusTones[item.status]}>
                  {statusLabels[item.status] ?? humanize(item.status)}
                </AppBadge>
                <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
                  {relative(item.updatedAt)}
                </span>
              </Link>
            ))}
            {!data.recentApplications.length ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No applications yet.
              </div>
            ) : null}
          </div>
        </AppCard>
      </div>
    </section>
  );
}
