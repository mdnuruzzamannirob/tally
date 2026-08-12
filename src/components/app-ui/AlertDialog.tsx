import type { ComponentProps } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent as PrimitiveAlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter as PrimitiveAlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

function AlertDialogContent({
  className,
  ...props
}: ComponentProps<typeof PrimitiveAlertDialogContent>) {
  return (
    <PrimitiveAlertDialogContent
      className={cn("rounded-lg border border-border bg-surface shadow-modal", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: ComponentProps<typeof PrimitiveAlertDialogFooter>) {
  return (
    <PrimitiveAlertDialogFooter
      className={cn(
        "-mx-6 -mb-6 mt-2 rounded-b-lg border-t-2 border-border-strong bg-secondary px-6 py-4",
        "gap-2 sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
