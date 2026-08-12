import type { TextareaHTMLAttributes } from "react";

import { Textarea as PrimitiveTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean };

export function Textarea({ className, error = false, ...props }: TextareaProps) {
  return (
    <PrimitiveTextarea
      aria-invalid={error || props["aria-invalid"] || undefined}
      className={cn(
        "min-h-24 rounded-md border-2 border-border bg-surface px-3 text-base shadow-none",
        "placeholder:text-muted-foreground hover:border-border-strong transition-colors",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary-ring",
        error && "border-danger focus-visible:border-danger focus-visible:ring-danger/25",
        className,
      )}
      {...props}
    />
  );
}
