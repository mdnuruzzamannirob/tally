'use client';

import {
  AppBreadcrumb,
  AppButton,
  AppDropdownMenu,
  AppPageHeader,
  AppPagination,
  AppSegmentedControl,
  AppTabs,
} from '@/components/app-ui';
import { Mail, WalletCards } from 'lucide-react';
import { useState } from 'react';

export function NavigationSection() {
  const [page, setPage] = useState(1);
  const [segment, setSegment] = useState('monthly');

  return (
    <div className="space-y-12">
      {/* Buttons */}
      <section className="scroll-mt-6 space-y-4" id="buttons-actions">
        <h3 className="text-lg font-semibold">Buttons & Actions</h3>
        <div className="flex flex-wrap gap-3">
          <AppButton variant="default">Primary</AppButton>
          <AppButton variant="secondary">Secondary</AppButton>
          <AppButton variant="outline">Outline</AppButton>
          <AppButton variant="ghost">Ghost</AppButton>
          <AppButton variant="destructive">Destructive</AppButton>
          <AppButton loading>Loading</AppButton>
          <AppButton disabled>Disabled</AppButton>
        </div>
      </section>

      {/* Page Header */}
      <section className="scroll-mt-6 space-y-4" id="page-header">
        <h3 className="text-lg font-semibold">Page Header</h3>
        <div className="rounded-lg border border-border bg-card p-4">
          <AppPageHeader
            actions={<AppButton size="sm">Add Transaction</AppButton>}
            description="Manage and monitor your primary checking accounts."
            title="Wallets Overview"
          />
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="scroll-mt-6 space-y-4" id="breadcrumbs">
        <h3 className="text-lg font-semibold">Breadcrumbs</h3>
        <AppBreadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Wallets', href: '/wallets' },
            { label: 'Checking Account' },
          ]}
        />
      </section>

      {/* Segmented Control & Tabs */}
      <section className="scroll-mt-6 space-y-4" id="tabs-navigation">
        <h3 className="text-lg font-semibold">Segmented Controls & Tabs</h3>
        <div className="space-y-4">
          <AppSegmentedControl
            onValueChange={(val) => setSegment(val ?? 'monthly')}
            options={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Yearly', value: 'yearly' },
            ]}
            value={segment}
          />
          <AppTabs
            defaultValue="overview"
            items={[
              {
                value: 'overview',
                label: 'Overview',
                content: <p className="p-2 text-sm text-muted-foreground">Overview Tab Content</p>,
              },
              {
                value: 'transactions',
                label: 'Transactions',
                content: (
                  <p className="p-2 text-sm text-muted-foreground">Transactions Tab Content</p>
                ),
              },
              {
                value: 'analytics',
                label: 'Analytics',
                content: <p className="p-2 text-sm text-muted-foreground">Analytics Tab Content</p>,
              },
            ]}
          />
        </div>
      </section>

      {/* Pagination & Dropdown */}
      <section className="scroll-mt-6 space-y-4" id="pagination-dropdowns">
        <h3 className="text-lg font-semibold">Pagination & Dropdowns</h3>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
          <AppPagination onPageChange={setPage} page={page} totalPages={10} />
          <AppDropdownMenu
            items={[
              { label: 'View Profile', onSelect: () => {}, icon: <Mail className="size-4" /> },
              {
                label: 'Wallet Settings',
                onSelect: () => {},
                icon: <WalletCards className="size-4" />,
              },
            ]}
            trigger={<AppButton variant="outline">Options Menu</AppButton>}
          />
        </div>
      </section>
    </div>
  );
}
