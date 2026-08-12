"use client";
import { cn } from "@/lib/utils";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { useId } from "react";
export type AppSwitchSize = "sm" | "md" | "lg";
const tracks = { sm: "h-4 w-7", md: "h-5 w-9", lg: "h-6 w-11" };
const thumbs = {
  sm: "size-3 data-checked:translate-x-3",
  md: "size-4 data-checked:translate-x-4",
  lg: "size-5 data-checked:translate-x-5",
};
export function AppSwitch({
  checked,
  className,
  defaultChecked,
  description,
  disabled,
  label,
  onCheckedChange,
  size = "md",
}: {
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  description?: string;
  disabled?: boolean;
  label: string;
  onCheckedChange?: (checked: boolean) => void;
  size?: AppSwitchSize;
}) {
  const id = useId();
  return (
    <div
      data-disabled={disabled || undefined}
      className={cn(
        "group/switch flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-[background-color,border-color,opacity] data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-border/70 data-[disabled=true]:bg-muted/50 data-[disabled=true]:opacity-70",
        className,
      )}
    >
      <label className="group-data-[disabled=true]/switch:text-muted-foreground" htmlFor={id}>
        <span className="block text-sm font-medium">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
        ) : null}
      </label>
      <SwitchPrimitive.Root
        checked={checked}
        className={cn(
          "ui-checked-gradient relative inline-flex shrink-0 items-center rounded-full border-0! bg-input p-0.5 outline-none transition-[background-color,box-shadow,filter] focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:saturate-0",
          tracks[size],
        )}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        onCheckedChange={onCheckedChange}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "block translate-x-0 rounded-full bg-primary-foreground shadow-none transition-transform",
            thumbs[size],
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
}
