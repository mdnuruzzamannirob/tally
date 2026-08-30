"use client";
import { cn } from "@/lib/utils";
import { AppInput, type AppInputProps } from "./app-input";
export type AppCurrencyInputProps = Omit<AppInputProps, "leading" | "type"> & { currency?: string };
export function AppCurrencyInput({
  currency = "৳",
  inputMode = "decimal",
  ...props
}: AppCurrencyInputProps) {
  return (
    <AppInput
      {...props}
      className={cn("pl-9", props.className)}
      inputMode={inputMode}
      leading={
        <span className="grid size-4 place-items-center text-sm font-medium">{currency}</span>
      }
      leadingClassName="left-3"
      type="text"
    />
  );
}
