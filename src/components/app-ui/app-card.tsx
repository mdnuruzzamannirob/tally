import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type AppCardProps = HTMLAttributes<HTMLElement> & { padding?: "none" | "sm" | "md" | "lg" };
export function AppCard({ className, padding = "md", ...props }: AppCardProps) {
  return (
    <section
      {...props}
      className={cn(
        "rounded-lg border border-border bg-card shadow-none",
        { none: "", sm: "p-4", md: "p-5", lg: "p-6" }[padding],
        className,
      )}
    />
  );
}
