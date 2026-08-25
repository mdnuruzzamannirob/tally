import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
export type AppBadgeStatus = "neutral" | "info" | "success" | "warning" | "danger";
export type AppBadgeSize = "sm" | "md" | "lg";
export type AppApplicationStatus =
  | "wishlist"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";
export type AppInterviewStatus = "scheduled" | "completed" | "cancelled" | "no-show";
export function AppBadge({
  children,
  className,
  size = "md",
  status = "neutral",
}: {
  children: ReactNode;
  className?: string;
  size?: AppBadgeSize;
  status?: AppBadgeStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border font-medium",
        { sm: "px-1.5 py-0.5 text-[10px]", md: "px-2 py-0.5 text-xs", lg: "px-2.5 py-1 text-sm" }[
          size
        ],
        {
          neutral: "border-border bg-muted text-muted-foreground",
          info: "border-info-border bg-info-soft text-info-text",
          success: "border-success-border bg-success-soft text-success-text",
          warning: "border-warning-border bg-warning-soft text-warning-text",
          danger: "border-danger-border bg-danger-soft text-danger-text",
        }[status],
        className,
      )}
    >
      {children}
    </span>
  );
}

const applicationStatusTokens: Record<AppApplicationStatus, [string, string, string]> = {
  wishlist: ["--st-wishlist-bg", "--st-wishlist-tx", "--st-wishlist-bd"],
  applied: ["--st-applied-bg", "--st-applied-tx", "--st-applied-bd"],
  screening: ["--st-screening-bg", "--st-screening-tx", "--st-screening-bd"],
  interview: ["--st-interview-bg", "--st-interview-tx", "--st-interview-bd"],
  offer: ["--st-offer-bg", "--st-offer-tx", "--st-offer-bd"],
  rejected: ["--st-rejected-bg", "--st-rejected-tx", "--st-rejected-bd"],
  withdrawn: ["--st-withdrawn-bg", "--st-withdrawn-tx", "--st-withdrawn-bd"],
};
const interviewStatusTokens: Record<AppInterviewStatus, [string, string, string]> = {
  scheduled: ["--iv-scheduled-bg", "--iv-scheduled-tx", "--iv-scheduled-bd"],
  completed: ["--iv-completed-bg", "--iv-completed-tx", "--iv-completed-bd"],
  cancelled: ["--iv-cancelled-bg", "--iv-cancelled-tx", "--iv-cancelled-bd"],
  "no-show": ["--iv-noshow-bg", "--iv-noshow-tx", "--iv-noshow-bd"],
};

function tokenStyle(tokens: [string, string, string]): CSSProperties {
  return {
    backgroundColor: `var(${tokens[0]})`,
    borderColor: `var(${tokens[2]})`,
    color: `var(${tokens[1]})`,
  } as CSSProperties;
}

export function AppStatusBadge({
  children,
  className,
  size = "md",
  status,
}: {
  children: ReactNode;
  className?: string;
  size?: AppBadgeSize;
  status: AppApplicationStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border font-medium",
        { sm: "px-1.5 py-0.5 text-[10px]", md: "px-2 py-0.5 text-xs", lg: "px-2.5 py-1 text-sm" }[size],
        className,
      )}
      style={tokenStyle(applicationStatusTokens[status])}
    >
      {children}
    </span>
  );
}

export function AppInterviewStatusBadge({
  children,
  className,
  size = "md",
  status,
}: {
  children: ReactNode;
  className?: string;
  size?: AppBadgeSize;
  status: AppInterviewStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border font-medium",
        { sm: "px-1.5 py-0.5 text-[10px]", md: "px-2 py-0.5 text-xs", lg: "px-2.5 py-1 text-sm" }[size],
        className,
      )}
      style={tokenStyle(interviewStatusTokens[status])}
    >
      {children}
    </span>
  );
}
