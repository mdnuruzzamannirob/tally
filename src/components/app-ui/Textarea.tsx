import type { TextareaHTMLAttributes } from "react";

import { Textarea as PrimitiveTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean };

export function Textarea({ className, error = false, ...props }: TextareaProps) {
  return (
    <PrimitiveTextarea
      aria-invalid={error || props["aria-invalid"] || undefined}
      className={cn(
        "min-h-24 rounded-md border-border-strong bg-surface text-base shadow-none",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary-ring",
        error && "border-danger focus-visible:border-danger focus-visible:ring-danger/25",
        className,
      )}
      {...props}
    />
  );
}
