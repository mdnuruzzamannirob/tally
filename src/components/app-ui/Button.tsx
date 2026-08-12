import type { ComponentProps } from "react";

import { Button as PrimitiveButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = Omit<ComponentProps<typeof PrimitiveButton>, "variant"> & {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "link";
  loading?: boolean;
};

/** The app-owned wrapper around the project's shadcn-compatible button primitive. */
export function Button({
  className,
  variant = "primary",
  type = "button",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const primitiveVariant =
    variant === "danger"
      ? "destructive"
      : variant === "ghost"
        ? "ghost"
        : variant === "outline"
          ? "outline"
          : variant === "link"
            ? "link"
            : variant === "secondary"
              ? "secondary"
              : "default";
  return (
    <PrimitiveButton
      type={type}
      variant={primitiveVariant}
      className={cn(
        "border font-semibold transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-primary-ring",
        "disabled:cursor-not-allowed disabled:opacity-100",
        variant === "primary" &&
          "border-primary bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active",
        variant === "secondary" &&
          "border-secondary bg-secondary text-secondary-foreground hover:bg-surface-muted hover:text-foreground",
        variant === "danger" &&
          "border-danger bg-danger text-white hover:bg-danger-hover active:bg-danger-hover",
        variant === "ghost" &&
          "border-border bg-surface-muted text-foreground hover:bg-secondary hover:text-foreground",
        variant === "outline" &&
          "border-primary-border bg-primary-subtle text-primary-text hover:bg-primary hover:text-primary-foreground",
        variant === "link" &&
          "border-primary-border bg-primary-subtle text-primary-text hover:bg-primary hover:text-primary-foreground",
        (disabled || loading) && "border-muted bg-muted text-muted-foreground",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </PrimitiveButton>
  );
}
