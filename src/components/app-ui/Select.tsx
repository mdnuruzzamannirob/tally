import type { ComponentProps } from "react";

import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger as PrimitiveSelectTrigger,
  SelectContent as PrimitiveSelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

function SelectTrigger({ className, ...props }: ComponentProps<typeof PrimitiveSelectTrigger>) {
  return (
    <PrimitiveSelectTrigger
      className={cn("h-10 rounded-md border-border-strong bg-surface", className)}
      {...props}
    />
  );
}

function SelectContent({ className, ...props }: ComponentProps<typeof PrimitiveSelectContent>) {
  return (
    <PrimitiveSelectContent
      className={cn("rounded-md border border-border bg-surface shadow-popover", className)}
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
