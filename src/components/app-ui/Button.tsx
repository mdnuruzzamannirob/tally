import type { ComponentProps } from "react";

import { Button as PrimitiveButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = Omit<ComponentProps<typeof PrimitiveButton>, "variant"> & {
  variant?: "primary" | "secondary" | "danger";
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
    variant === "danger" ? "destructive" : variant === "secondary" ? "secondary" : "default";
  return (
    <PrimitiveButton
      type={type}
      variant={primitiveVariant}
      className={cn(
        "font-semibold transition-colors duration-fast",
        variant === "primary" && "shadow-primary-control",
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
