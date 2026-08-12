'use client';
import type { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
export function AppConfirmDialog({
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  description,
  onConfirm,
  open,
  onOpenChange,
  title,
  variant = 'danger',
}: {
  cancelLabel?: string;
  confirmLabel?: string;
  description: ReactNode;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: ReactNode;
  variant?: 'default' | 'danger';
}) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent className="gap-0 overflow-hidden rounded-xl p-6">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="-mx-6 -mb-6 mt-6 border-t border-border bg-secondary px-6 py-4">
          <AlertDialogCancel className="bg-card hover:bg-card/80">{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            className={
              variant === 'danger'
                ? 'ui-gradient-danger border-0! hover:brightness-[.98]'
                : 'ui-gradient-primary border-0! hover:brightness-[.98]'
            }
            onClick={onConfirm}
            variant="default"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
