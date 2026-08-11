import type { ComponentProps } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent as PrimitiveSheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
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
