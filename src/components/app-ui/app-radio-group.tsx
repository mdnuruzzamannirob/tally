"use client";
import type { ReactNode } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
export type AppRadioOption = {
  description?: string;
  disabled?: boolean;
  label: ReactNode;
  value: string;
};
export function AppRadioGroup({
  className,
  options,
  ...props
}: React.ComponentProps<typeof RadioGroup> & { options: readonly AppRadioOption[] }) {
  return (
    <RadioGroup {...props} className={cn("gap-3", className)}>
      {options.map((option) => (
        <label
          className={cn(
            "flex cursor-pointer select-none items-center gap-3 text-sm has-disabled:cursor-not-allowed has-disabled:opacity-60",
            option.description && "items-start",
          )}
          key={option.value}
        >
          <RadioGroupItem
            className="size-5 rounded-full border-border bg-card data-checked:border-primary! data-checked:bg-primary! data-checked:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary/25"
            disabled={option.disabled}
            value={option.value}
          />
          <span className={cn("min-w-0", option.description && "mt-0.5")}>
            <span className="block text-sm font-medium leading-5">{option.label}</span>
            {option.description ? (
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {option.description}
              </span>
            ) : null}
          </span>
        </label>
      ))}
    </RadioGroup>
  );
}
