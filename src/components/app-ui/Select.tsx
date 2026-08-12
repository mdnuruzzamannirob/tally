import type { ComponentProps } from "react";

import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger as PrimitiveSelectTrigger,
  SelectContent as PrimitiveSelectContent,
  SelectLabel,
  SelectItem as PrimitiveSelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

function SelectTrigger({ className, ...props }: ComponentProps<typeof PrimitiveSelectTrigger>) {
  return (
    <PrimitiveSelectTrigger
      className={cn(
        "h-10 rounded-md border-2 border-border bg-surface px-3 shadow-none",
        "hover:border-border-strong data-popup-open:border-primary data-popup-open:ring-2 data-popup-open:ring-primary-ring",
        className,
      )}
      {...props}
    />
  );
}

function SelectContent({ className, ...props }: ComponentProps<typeof PrimitiveSelectContent>) {
  return (
    <PrimitiveSelectContent
      className={cn(
        "mt-1 rounded-md border-2 border-border bg-surface p-1.5 shadow-popover",
        "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({ className, ...props }: ComponentProps<typeof PrimitiveSelectItem>) {
  return (
    <PrimitiveSelectItem
      className={cn("cursor-pointer rounded-sm px-3 py-2 hover:bg-surface-muted", className)}
      {...props}
    />
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
