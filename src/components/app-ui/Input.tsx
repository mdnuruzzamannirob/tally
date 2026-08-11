import type { InputHTMLAttributes } from "react";

import { Input as PrimitiveInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <PrimitiveInput className={cn("app-input", className)} {...props} />;
}
