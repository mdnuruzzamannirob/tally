import type { ComponentProps } from "react";

import { Badge as PrimitiveBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BadgeProps = ComponentProps<typeof PrimitiveBadge> & {
  tone?: "default" | "success" | "warning" | "danger" | "info";
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <PrimitiveBadge
      className={cn(
        "rounded-sm border font-medium",
        tone === "success" && "border-success/25 bg-success-soft text-success",
        tone === "warning" && "border-warning/25 bg-warning-soft text-warning",
        tone === "danger" && "border-danger/25 bg-danger-soft text-danger",
        tone === "info" && "border-info/25 bg-info-soft text-info",
        className,
      )}
      {...props}
    />
  );
}
