import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
export function AppStatCard({
  change,
  icon,
  label,
  tone = "primary",
  variant = "default",
  value,
}: {
  change?: ReactNode;
  icon: ReactNode;
  label: ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "info";
  variant?: "default" | "compact" | "featured";
  value: ReactNode;
}) {
  return (
    <article
      className={cn(
        "relative flex min-h-33 w-full flex-col gap-0 overflow-hidden rounded-lg border border-border",
        {
          default: "bg-card p-4",
          compact: "bg-card p-3",
          featured: "border-primary bg-primary p-4 text-primary-foreground",
        }[variant],
      )}
    >
      <div className="flex shrink-0 items-start justify-between">
        <span
          className={cn(
            "grid size-9 place-items-center rounded-md transition-colors [&>svg]:size-4.5",
            {
              primary:
                variant === "featured"
                  ? "bg-primary-foreground text-primary"
                  : "bg-primary text-primary-foreground",
              success:
                variant === "featured"
                  ? "bg-primary-foreground text-success"
                  : "bg-success text-white",
              warning:
                variant === "featured"
                  ? "bg-primary-foreground text-warning"
                  : "bg-warning text-white",
              danger:
                variant === "featured"
                  ? "bg-primary-foreground text-danger"
                  : "bg-danger text-white",
              info:
                variant === "featured" ? "bg-primary-foreground text-info" : "bg-info text-white",
            }[tone],
          )}
        >
          {icon}
        </span>
        {change ? (
          <span
            className={cn(
              "text-xs font-medium",
              variant === "featured"
                ? "bg-primary-foreground/15 text-primary-foreground/90"
                : "text-muted-foreground",
            )}
          >
            {change}
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          "mt-3 shrink-0 text-sm leading-4",
          variant === "featured" ? "text-primary-foreground/80" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p className="mt-1.5 shrink-0 text-2xl font-semibold leading-none tracking-tight">{value}</p>
    </article>
  );
}
