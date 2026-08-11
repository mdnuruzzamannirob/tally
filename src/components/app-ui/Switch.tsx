import type { ComponentProps } from "react";

import { Switch as PrimitiveSwitch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function Switch({ className, ...props }: ComponentProps<typeof PrimitiveSwitch>) {
  return (
    <PrimitiveSwitch
      className={cn(
        "rounded-full shadow-none focus-visible:ring-2 focus-visible:ring-primary-ring",
        className,
      )}
      {...props}
    />
  );
}
