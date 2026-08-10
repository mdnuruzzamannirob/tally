import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

/** The app-owned wrapper around the project's shadcn-compatible button primitive. */
export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx("app-button", `app-button--${variant}`, className)}
      {...props}
    />
  );
}
