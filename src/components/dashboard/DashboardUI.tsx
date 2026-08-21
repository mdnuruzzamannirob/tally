"use client";
import { AppButton, AppCard, AppEmptyState, AppPageHeader, AppStatCard } from "@/components/app-ui";
import { useApplicationsQuery } from "@/store/api/applications.api";
import {
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Plus,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
export function DashboardUI() {
  const { data, isLoading } = useApplicationsQuery();
  const applications = data?.data.items || [];
  const active = applications.filter(({ status }) =>
    ["APPLIED", "SCREENING", "INTERVIEW"].includes(status),
  ).length;
  const offers = applications.filter(({ status }) => status === "OFFER").length;
  return (
    <section className="space-y-7">
      <AppPageHeader
        title="Dashboard"
        description="A clear view of your job-search momentum."
        actions={
          <AppButton>
            <Plus /> Add application
          </AppButton>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AppStatCard
          icon={<BriefcaseBusiness />}
          label="Total applications"
          value={isLoading ? "—" : applications.length}
        />
        <AppStatCard
          icon={<TrendingUp />}
          label="Active applications"
          tone="info"
          value={isLoading ? "—" : active}
        />
        <AppStatCard
          icon={<CalendarDays />}
          label="Scheduled interviews"
          tone="warning"
          value="—"
        />
        <AppStatCard
          icon={<CircleDollarSign />}
          label="Offers"
          tone="success"
          value={isLoading ? "—" : offers}
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,.65fr)]">
        <AppCard>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold">Status distribution</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your current application pipeline
              </p>
            </div>
            <span className="text-sm text-muted-foreground">{applications.length} total</span>
          </div>
          {applications.length ? (
            <div className="mt-7 space-y-4">
              {["WISHLIST", "APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED"].map(
                (status) => {
                  const count = applications.filter((item) => item.status === status).length;
                  const percent = applications.length
                    ? Math.round((count / applications.length) * 100)
                    : 0;
                  return (
                    <div key={status}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span>{status.charAt(0) + status.slice(1).toLowerCase()}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-sm bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          ) : (
            <AppEmptyState
              className="py-8"
              description="Add your first application to start seeing pipeline insights."
              icon={<TrendingUp />}
              title="Your pipeline will appear here"
            />
          )}
        </AppCard>
        <AppCard>
          <h2 className="font-semibold">Follow-ups</h2>
          <p className="mt-1 text-sm text-muted-foreground">Stay ahead of important next steps.</p>
          <div className="mt-5 rounded-md border border-dashed border-border bg-muted/30 p-4">
            <Clock3 className="size-5 text-warning" />
            <p className="mt-2 text-sm font-medium">You&apos;re all caught up</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Due and overdue follow-ups will show up here.
            </p>
          </div>
        </AppCard>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <AppCard padding="none">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-semibold">Recent applications</h2>
              <p className="mt-1 text-sm text-muted-foreground">Recently added or updated</p>
            </div>
            <Link className="text-sm font-medium text-primary hover:underline" href="/applications">
              View all
            </Link>
          </div>
          {applications.length ? (
            <div className="divide-y divide-border">
              {applications.slice(0, 5).map((item) => (
                <Link
                  className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-muted/50"
                  href={`/applications/${item.id}`}
                  key={item.id}
                >
                  <span>
                    <span className="block text-sm font-medium">{item.company}</span>
                    <span className="block text-xs text-muted-foreground">{item.role}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{item.status.toLowerCase()}</span>
                </Link>
              ))}
            </div>
          ) : (
            <AppEmptyState
              description="Applications you add will be easy to pick up from here."
              icon={<BriefcaseBusiness />}
              title="No recent applications"
            />
          )}
        </AppCard>
        <AppCard>
          <AppEmptyState
            description="Schedule interviews from an application and upcoming conversations will be listed here."
            icon={<CalendarDays />}
            title="No upcoming interviews"
            action={<AppButton tone="outline">View interviews</AppButton>}
          />
        </AppCard>
      </div>
    </section>
  );
}
