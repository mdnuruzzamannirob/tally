import type { InputHTMLAttributes } from "react";

import { Input as PrimitiveInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { error?: boolean };

export function Input({ className, error = false, ...props }: InputProps) {
  return (
    <PrimitiveInput
      aria-invalid={error || props["aria-invalid"] || undefined}
      className={cn(
        "h-10 rounded-md border-border-strong bg-surface text-base shadow-none transition-colors",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary-ring",
        error && "border-danger focus-visible:border-danger focus-visible:ring-danger/25",
        className,
      )}
      {...props}
    />
  );
}
