import type { ComponentProps } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent as PrimitiveDialogContent,
  DialogDescription,
  DialogFooter as PrimitiveDialogFooter,
  DialogHeader as PrimitiveDialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle as PrimitiveDialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function DialogContent({ className, ...props }: ComponentProps<typeof PrimitiveDialogContent>) {
  return (
    <PrimitiveDialogContent
      className={cn("rounded-lg border border-border bg-surface shadow-modal", className)}
      {...props}
    />
  );
}

function DialogHeader({ className, ...props }: ComponentProps<typeof PrimitiveDialogHeader>) {
  return <PrimitiveDialogHeader className={cn("gap-2", className)} {...props} />;
}

function DialogTitle({ className, ...props }: ComponentProps<typeof PrimitiveDialogTitle>) {
  return <PrimitiveDialogTitle className={cn("text-lg font-semibold", className)} {...props} />;
}

function DialogFooter({ className, ...props }: ComponentProps<typeof PrimitiveDialogFooter>) {
  return (
    <PrimitiveDialogFooter
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
