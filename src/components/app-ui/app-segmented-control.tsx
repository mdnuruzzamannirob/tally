'use client';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
export function AppSegmentedControl({
  className,
  onValueChange,
  options,
  value,
}: {
  className?: string;
  onValueChange?: (value: string | null) => void;
  options: readonly { icon?: ReactNode; label: ReactNode; value: string }[];
  value?: string | null;
}) {
  return (
    <ToggleGroup
      className={cn(
        'grid h-10 w-full grid-flow-col rounded-md border border-border bg-card p-1',
        className,
      )}
      multiple={false}
      onValueChange={(next) => onValueChange?.(next[0] ?? null)}
      spacing={0}
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
      value={value ? [value] : undefined}
      variant="default"
    >
      {options.map((option) => (
        <ToggleGroupItem
          className="ui-active-gradient h-8! min-w-0 rounded-sm! px-3 text-sm text-muted-foreground hover:text-foreground"
          key={option.value}
          value={option.value}
        >
          {option.icon}
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
