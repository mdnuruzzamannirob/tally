'use client';

import {
  AppAlert,
  AppButton,
  AppConfirmDialog,
  AppModal,
  AppPopover,
  AppProgress,
  AppSheet,
  AppTooltip,
} from '@/components/app-ui';
import { useState } from 'react';

export function FeedbackOverlaysSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="space-y-12">
      {/* Alerts */}
      <section className="scroll-mt-6 space-y-4" id="alerts">
        <h3 className="text-lg font-semibold">Alert Messages</h3>
        <div className="space-y-3">
          <AppAlert title="Budget Saved" tone="success">
            Your monthly budget limit has been updated.
          </AppAlert>
          <AppAlert title="Budget Notice" tone="warning">
            You have reached 85% of your monthly dining limit.
          </AppAlert>
          <AppAlert title="Sync Error" tone="danger">
            Unable to synchronize latest wallet data with server.
          </AppAlert>
          <AppAlert title="Notification" tone="info">
            New family member joined your shared workspace.
          </AppAlert>
        </div>
      </section>

      {/* Progress */}
      <section className="scroll-mt-6 space-y-4" id="progress">
        <h3 className="text-lg font-semibold">Progress Bars</h3>
        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <div>
            <div className="mb-1.5 flex justify-between text-sm">
              <span>Savings Goal (Car Fund)</span>
              <span>75%</span>
            </div>
            <AppProgress value={75} />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-sm text-warning">
              <span>Monthly Budget Used</span>
              <span>88%</span>
            </div>
            <AppProgress value={88} />
          </div>
        </div>
      </section>

      {/* Modals, Sheets & Dialogs */}
      <section className="scroll-mt-6 space-y-4" id="overlays">
        <h3 className="text-lg font-semibold">Modals, Sheets & Confirmations</h3>
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-6">
          <AppButton onClick={() => setModalOpen(true)}>Open Modal</AppButton>
          <AppButton onClick={() => setSheetOpen(true)} variant="secondary">
            Open Sheet
          </AppButton>
          <AppButton onClick={() => setConfirmOpen(true)} variant="destructive">
            Delete Wallet
          </AppButton>

          <AppPopover trigger={<AppButton variant="outline">Popover Info</AppButton>}>
            <p className="p-3 text-sm">Additional context information.</p>
          </AppPopover>

          <AppTooltip content="Click to view details">
            <span className="cursor-pointer text-sm underline">Hover for Tooltip</span>
          </AppTooltip>

          {/* Modal */}
          <AppModal
            footer={
              <>
                <AppButton onClick={() => setModalOpen(false)} variant="outline">
                  Cancel
                </AppButton>
                <AppButton onClick={() => setModalOpen(false)}>Confirm Action</AppButton>
              </>
            }
            onOpenChange={setModalOpen}
            open={modalOpen}
            title="App Modal Demonstration"
          >
            <p className="text-sm text-muted-foreground">
              This is a standard MoneyBag application modal component designed for consistent
              dialogs.
            </p>
          </AppModal>

          {/* Sheet */}
          <AppSheet
            footer={
              <AppButton className="w-full" onClick={() => setSheetOpen(false)}>
                Apply Filters
              </AppButton>
            }
            onOpenChange={setSheetOpen}
            open={sheetOpen}
            title="Quick Filters"
          >
            <p className="text-sm text-muted-foreground">
              Side sheet drawer panel for quick filters and actions.
            </p>
          </AppSheet>

          {/* Confirm Dialog */}
          <AppConfirmDialog
            description="Are you sure you want to delete this cash wallet? This operation cannot be undone."
            onConfirm={() => setConfirmOpen(false)}
            onOpenChange={setConfirmOpen}
            open={confirmOpen}
            title="Confirm Wallet Deletion"
          />
        </div>
      </section>
    </div>
  );
}
