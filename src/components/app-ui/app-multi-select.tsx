'use client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppInput } from './app-input';
import type { AppSelectOption } from './app-select';
export function AppMultiSelect({
  onValueChange,
  options,
  placeholder = 'Select options',
  value,
}: {
  onValueChange?: (values: string[]) => void;
  options: readonly AppSelectOption[];
  placeholder?: string;
  value?: string[];
}) {
  const [query, setQuery] = useState('');
  const [internalValue, setInternalValue] = useState<string[]>([]);
  const currentValue = value ?? internalValue;
  const filtered = useMemo(
    () =>
      options.filter((option) => String(option.label).toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );
  const update = (next: string[]) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };
  const toggle = (next: string) =>
    update(
      currentValue.includes(next)
        ? currentValue.filter((item) => item !== next)
        : [...currentValue, next],
    );
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            className="flex h-10 w-full items-center gap-2 rounded-md border border-border bg-background! px-3 text-sm outline-none transition-[color,border-color,box-shadow] duration-100 hover:border-border focus:border-primary focus:ring-3 focus:ring-primary/15 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 data-popup-open:border-primary data-popup-open:ring-3 data-popup-open:ring-primary/15 aria-expanded:border-primary aria-expanded:ring-3 aria-expanded:ring-primary/15"
            type="button"
          >
            <span
              className={cn(
                'min-w-0 flex-1 truncate text-left',
                currentValue.length ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {currentValue.length ? `${currentValue.length} selected` : placeholder}
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </button>
        }
      />
      <PopoverContent
        align="start"
        className="w-max min-w-(--anchor-width) max-w-[calc(100vw-2rem)] gap-1.5 rounded-lg p-1.5"
      >
        <AppInput
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search options..."
          value={query}
        />
        <div className="max-h-56 w-full space-y-0.5 overflow-y-auto">
          {filtered.map((option) => {
            const selected = currentValue.includes(option.value);
            return (
              <button
                className={cn(
                  'flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-primary/10',
                  selected && 'bg-primary/10 text-primary',
                )}
                disabled={option.disabled}
                key={option.value}
                onClick={() => toggle(option.value)}
                type="button"
              >
                {option.icon ? (
                  <span className="mt-0.5 shrink-0 text-muted-foreground [&>svg]:size-4">
                    {option.icon}
                  </span>
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="block wrap-break-word text-sm font-medium">{option.label}</span>
                  {option.description ? (
                    <span
                      className={cn(
                        'mt-0.5 block wrap-break-word text-xs',
                        selected ? 'text-primary/80' : 'text-muted-foreground',
                      )}
                    >
                      {option.description}
                    </span>
                  ) : null}
                </span>
                {selected ? <Check className="mt-0.5 size-4 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
        {currentValue.length ? (
          <button
            className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => update([])}
            type="button"
          >
            <X className="size-3" />
            Clear selection
          </button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
