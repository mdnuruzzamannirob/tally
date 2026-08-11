import type { ButtonHTMLAttributes } from "react";

import { Button as PrimitiveButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

/** The app-owned wrapper around the project's shadcn-compatible button primitive. */
export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  const primitiveVariant =
    variant === "danger" ? "destructive" : variant === "secondary" ? "secondary" : "default";
  return (
    <PrimitiveButton
      type={type}
      variant={primitiveVariant}
      className={cn("app-button", `app-button--${variant}`, className)}
      {...props}
    />
  );
}
