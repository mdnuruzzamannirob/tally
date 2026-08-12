'use client';
import { useState } from 'react';
export function AppRangeSlider({
  defaultValue = 50,
  label,
  max = 100,
  min = 0,
  onValueChange,
  suffix = '',
  value,
}: {
  defaultValue?: number;
  label?: string;
  max?: number;
  min?: number;
  onValueChange?: (value: number) => void;
  suffix?: string;
  value?: number;
}) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value ?? internal;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
          {current}
          {suffix}
        </span>
      </div>
      <input
        aria-label={label}
        className="ui-slider-thumb h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        max={max}
        min={min}
        onChange={(event) => {
          const next = Number(event.target.value);
          setInternal(next);
          onValueChange?.(next);
        }}
        type="range"
        value={current}
      />
      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span>
          {min}
          {suffix}
        </span>
        <span>
          {max}
          {suffix}
        </span>
      </div>
    </div>
  );
}
