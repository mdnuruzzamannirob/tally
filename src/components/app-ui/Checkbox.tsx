import type { ComponentProps } from "react";

import { Checkbox as PrimitiveCheckbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function Checkbox({ className, ...props }: ComponentProps<typeof PrimitiveCheckbox>) {
  return (
    <PrimitiveCheckbox
      className={cn(
        "rounded-sm border-border-strong shadow-none focus-visible:ring-2 focus-visible:ring-primary-ring",
        className,
      )}
      {...props}
    />
  );
}
