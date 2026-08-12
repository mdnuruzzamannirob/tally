import type { ComponentProps } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent as PrimitiveSheetContent,
  SheetDescription,
  SheetFooter as PrimitiveSheetFooter,
  SheetHeader as PrimitiveSheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function SheetContent({ className, ...props }: ComponentProps<typeof PrimitiveSheetContent>) {
  return (
    <PrimitiveSheetContent
      className={cn("border-border bg-surface shadow-modal", className)}
      {...props}
    />
  );
}

function SheetHeader({ className, ...props }: ComponentProps<typeof PrimitiveSheetHeader>) {
  return (
    <PrimitiveSheetHeader
      className={cn("border-b border-border px-6 pb-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: ComponentProps<typeof PrimitiveSheetFooter>) {
  return (
    <PrimitiveSheetFooter
      className={cn("border-t-2 border-border-strong bg-secondary px-6 py-4", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
