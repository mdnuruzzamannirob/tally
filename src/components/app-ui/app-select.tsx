"use client";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
export type AppSelectOption = {
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
  label: ReactNode;
  value: string;
};
export type AppSelectProps = Omit<
  React.ComponentProps<typeof Select>,
  "children" | "onValueChange"
> & {
  ariaLabel?: string;
  contentClassName?: string;
  leading?: ReactNode;
  onValueChange?: (value: string | null) => void;
  options: readonly AppSelectOption[];
  placeholder?: string;
  size?: "sm" | "default" | "lg";
  triggerClassName?: string;
};
export function AppSelect({
  ariaLabel,
  contentClassName,
  leading,
  onValueChange,
  options,
  placeholder = "Select an option",
  size = "default",
  triggerClassName,
  defaultValue,
  value,
  ...props
}: AppSelectProps) {
  const [internalValue, setInternalValue] = useState<string | null>(
    typeof defaultValue === "string" ? defaultValue : null,
  );
  const currentValue = typeof value === "string" ? value : internalValue;
  const selectedOption = currentValue
    ? options.find((option) => option.value === currentValue)
    : undefined;
  const selectOption = (value: string | null) => {
    setInternalValue(value);
    onValueChange?.(value);
  };
  return (
    <Select
      {...props}
      value={currentValue}
      onValueChange={(value) => selectOption(typeof value === "string" ? value : null)}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(
          "h-10 min-h-10 w-full gap-2 rounded-md border-border! bg-background! px-3 text-foreground shadow-none transition-[color,border-color,box-shadow] duration-100 hover:border-border! focus:border-primary! focus:ring-3 focus:ring-primary/25 focus-visible:border-primary! focus-visible:ring-3 focus-visible:ring-primary/25 data-[size=default]:h-10 data-[size=sm]:h-8 data-popup-open:border-primary! data-popup-open:ring-3 data-popup-open:ring-primary/25 aria-invalid:border-destructive! aria-invalid:focus-visible:border-destructive! aria-invalid:focus-visible:ring-destructive/25",
          { sm: "text-xs h-8! min-h-8", default: "text-sm", lg: "text-base h-11! min-h-11" }[size],
          triggerClassName,
        )}
        size={size === "lg" ? "default" : size}
      >
        {leading ? (
          <span className="shrink-0 text-muted-foreground [&>svg]:size-4">{leading}</span>
        ) : null}
        {selectedOption ? (
          <span className="min-w-0 flex-1 truncate text-left">{selectedOption.label}</span>
        ) : (
          <SelectValue className="min-w-0 truncate" placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent
        align="start"
        alignItemWithTrigger={false}
        className={cn(
          "w-max min-w-(--anchor-width) max-w-[calc(100vw-2rem)] rounded-md border border-border bg-popover p-1 shadow-popover ring-0 data-open:animate-none data-closed:animate-none **:data-[slot=select-item]:w-full",
          size === "sm" && "p-0.5",
          size === "lg" && "p-1.5",
          contentClassName,
        )}
        sideOffset={4}
      >
        {options.map((option) => (
          <SelectItem
            className={cn(
              "w-full max-w-none whitespace-normal rounded-sm pr-9 transition-none! animate-none! focus:bg-muted focus:text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[selected]:bg-primary-soft data-[selected]:text-primary-text **:whitespace-normal [&_[data-slot=select-item-indicator]]:!transition-none [&_[data-slot=select-item-indicator]]:!animate-none [&_[data-slot=select-item-indicator]]:!opacity-100 [&_[data-slot=select-item-indicator]]:!transform-none [&_[data-slot=select-item-indicator]_svg]:!transition-none [&_[data-slot=select-item-indicator]_svg]:!animate-none [&_[data-slot=select-item-indicator]_svg]:!opacity-100 [&_[data-slot=select-item-indicator]_svg]:!transform-none",
              {
                sm: "min-h-6 px-1.5 py-0.5 text-xs pr-7 **:data-[slot=select-item-indicator]:right-1 **:data-[slot=select-item-indicator]:size-3",
                default: "min-h-8 px-2.5 py-1 text-sm",
                lg: "min-h-10 px-3 py-1.5 text-sm",
              }[size],
            )}
            disabled={option.disabled}
            key={option.value}
            value={option.value}
          >
            {option.icon ? (
              <span
                className={cn(
                  "shrink-0 text-muted-foreground",
                  size === "sm"
                    ? "[&>svg]:size-3"
                    : size === "lg"
                      ? "[&>svg]:size-5"
                      : "[&>svg]:size-4",
                )}
              >
                {option.icon}
              </span>
            ) : null}
            <span className="min-w-0 flex-1">
              <span className="block wrap-break-word font-medium">{option.label}</span>
              {option.description ? (
                <span
                  className={cn(
                    "mt-0.5 block wrap-break-word font-normal text-muted-foreground",
                    size === "sm" ? "text-[10px]" : size === "lg" ? "text-sm" : "text-xs",
                  )}
                >
                  {option.description}
                </span>
              ) : null}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
