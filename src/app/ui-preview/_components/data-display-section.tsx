'use client';

import {
  AppAvatar,
  AppBadge,
  AppCard,
  AppEmptyState,
  AppKbd,
  AppSkeleton,
  AppStatCard,
  AppTable,
} from '@/components/app-ui';
import { CreditCard, TrendingDown, TrendingUp, WalletCards } from 'lucide-react';

export function DataDisplaySection() {
  return (
    <div className="space-y-12">
      {/* Stat Cards */}
      <section className="scroll-mt-6 space-y-4" id="stat-cards">
        <h3 className="text-lg font-semibold">Stat Cards</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AppStatCard
            change="+8.2%"
            icon={<WalletCards className="size-4" />}
            label="Total Balance"
            value="৳128,450"
          />
          <AppStatCard
            icon={<TrendingUp className="size-4" />}
            label="Monthly Income"
            tone="success"
            value="৳103,200"
          />
          <AppStatCard
            icon={<TrendingDown className="size-4" />}
            label="Monthly Expenses"
            tone="danger"
            value="৳24,870"
          />
          <AppStatCard
            icon={<CreditCard className="size-4" />}
            label="Budget Usage"
            tone="warning"
            value="68%"
          />
        </div>
      </section>

      {/* Badges, Avatars & Kbd */}
      <section className="scroll-mt-6 space-y-4" id="badges-avatars-kbd">
        <h3 className="text-lg font-semibold">Badges, Avatars & Keyboard Shortcuts</h3>
        <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border bg-card p-6">
          <div className="flex flex-wrap gap-2">
            <AppBadge status="info">Primary</AppBadge>
            <AppBadge status="success">Active</AppBadge>
            <AppBadge status="warning">Pending</AppBadge>
            <AppBadge status="danger">Failed</AppBadge>
          </div>
          <div className="flex items-center gap-3">
            <AppAvatar alt="Rahim Ahmed" fallback="RA" size="sm" />
            <AppAvatar alt="Family Member" fallback="FM" size="md" />
            <AppAvatar alt="Admin User" fallback="AU" size="lg" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Search shortcut:</span>
            <AppKbd>Ctrl + K</AppKbd>
          </div>
        </div>
      </section>

      {/* Tables & Skeletons */}
      <section className="scroll-mt-6 space-y-4" id="data-table">
        <h3 className="text-lg font-semibold">Data Table</h3>
        <AppTable
          columns={[
            { header: 'Transaction', key: 'name', render: (r) => r.name },
            { header: 'Category', key: 'category', render: (r) => r.category },
            { header: 'Amount', key: 'amount', render: (r) => r.amount },
            { header: 'Status', key: 'status', render: (r) => r.status },
          ]}

          getRowKey={(r) => r.name}
          rows={[
            {
              name: 'Grocery Supermarket',
              category: 'Food',
              amount: '৳4,500',
              status: <AppBadge status="success">Completed</AppBadge>,
            },
            {
              name: 'Electricity Bill',
              category: 'Utilities',
              amount: '৳2,100',
              status: <AppBadge status="success">Completed</AppBadge>,
            },
            {
              name: 'Online Subscription',
              category: 'Entertainment',
              amount: '৳850',
              status: <AppBadge status="warning">Pending</AppBadge>,
            },
          ]}
        />
      </section>

      {/* Cards, Skeletons & Empty State */}
      <section className="scroll-mt-6 grid gap-6 sm:grid-cols-2" id="cards-empty-state">
        <div>
          <h3 className="mb-4 text-lg font-semibold">App Card & Skeleton</h3>
          <AppCard className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Wallet Loading...</span>
              <AppSkeleton className="h-4 w-12" />
            </div>
            <AppSkeleton className="h-8 w-3/4" />
            <AppSkeleton className="h-4 w-1/2" />
          </AppCard>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Empty State</h3>
          <div className="rounded-lg border border-border bg-card p-6">
            <AppEmptyState
              description="You have no transactions logged for this selected period."
              title="No Recent Transactions"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
