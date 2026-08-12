'use client';
import { Minus, Plus } from 'lucide-react';
import { AppButton } from './app-button';
export function AppNumberInput({
  label,
  max = Number.MAX_SAFE_INTEGER,
  min = 0,
  onValueChange,
  value,
}: {
  label?: string;
  max?: number;
  min?: number;
  onValueChange?: (value: number) => void;
  value: number;
}) {
  const set = (next: number) => onValueChange?.(Math.max(min, Math.min(max, next)));
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        {label ? <span className="font-medium">{label}</span> : null}
        <span className="text-muted-foreground">
          {min}–{max}
        </span>
      </div>
      <div className="flex h-9 items-center rounded-md border border-border bg-background! px-1 transition-colors duration-100">
        <AppButton
          aria-label="Decrease"
          className="rounded-sm"
          disabled={value <= min}
          onClick={() => set(value - 1)}
          size="icon-xs"
          tone="ghost"
        >
          <Minus />
        </AppButton>
        <output className="grid flex-1 place-items-center text-sm font-medium">{value}</output>
        <AppButton
          aria-label="Increase"
          className="rounded-sm"
          disabled={value >= max}
          onClick={() => set(value + 1)}
          size="icon-xs"
          tone="ghost"
        >
          <Plus />
        </AppButton>
      </div>
    </div>
  );
}
