"use client";
import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
export function AppConfirmDialog({
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  description,
  onConfirm,
  open,
  onOpenChange,
  title,
  variant = "danger",
}: {
  cancelLabel?: string;
  confirmLabel?: string;
  description: ReactNode;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: ReactNode;
  variant?: "default" | "danger";
}) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent className="gap-0 overflow-hidden rounded-lg border-border bg-card p-0 shadow-modal">
        <AlertDialogHeader className="min-w-0 items-start gap-1 rounded-t-lg px-4 py-4 text-left sm:px-5">
          <AlertDialogTitle className="min-w-0 text-lg leading-6 wrap-break-word">
            {title}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="px-4 pb-4 sm:px-5">
          <AlertDialogDescription className="text-sm leading-5 wrap-break-word">
            {description}
          </AlertDialogDescription>
        </div>
        <AlertDialogFooter className="m-0 rounded-b-lg border-t border-border bg-secondary px-4 py-3 sm:px-5">
          <AlertDialogCancel
            className="border-transparent! bg-muted/35! text-foreground hover:bg-muted! hover:text-foreground"
            variant="ghost"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            className={
              variant === "danger"
                ? "border-danger! bg-danger! text-white hover:bg-danger-hover!"
                : "border-primary! bg-primary! text-primary-foreground hover:bg-primary-hover!"
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
