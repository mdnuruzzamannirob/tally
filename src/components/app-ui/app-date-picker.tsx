'use client';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
const triggerClass =
  'flex h-10 w-full items-center gap-2 rounded-md border border-border bg-background! px-3 text-sm shadow-none outline-none transition-[color,border-color,box-shadow] duration-100 hover:border-border focus:border-primary focus:ring-3 focus:ring-primary/25 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/25 data-popup-open:border-primary data-popup-open:ring-3 data-popup-open:ring-primary/25 aria-expanded:border-primary aria-expanded:ring-3 aria-expanded:ring-primary/25';
const calendarClass =
  '[--cell-radius:var(--radius-md)] [&_.rdp-dropdown_root]:rounded-md [&_.rdp_caption_label]:rounded-md [&_.rdp-day_button:focus]:!border-0 [&_.rdp-day_button:focus]:!outline-none [&_.rdp-day_button:focus]:!ring-0 [&_.rdp-day_button:focus]:!ring-transparent [&_.rdp-day[data-focused=true]_button]:!border-0 [&_.rdp-day[data-focused=true]_button]:!outline-none [&_.rdp-day[data-focused=true]_button]:!ring-0 [&_.rdp-day[data-focused=true]_button]:!ring-transparent [&_.rdp-day_button[data-range-start=true]:hover]:!bg-primary [&_.rdp-day_button[data-range-start=true]:hover]:!text-primary-foreground [&_.rdp-day_button[data-range-end=true]:hover]:!bg-primary [&_.rdp-day_button[data-range-end=true]:hover]:!text-primary-foreground [&_.rdp-day_button[data-range-middle=true]:hover]:!bg-muted [&_.rdp-day_button[data-range-middle=true]:hover]:!text-foreground [&_.rdp-day_button[data-selected-single=true]:hover]:!bg-primary [&_.rdp-day_button[data-selected-single=true]:hover]:!text-primary-foreground';
export function AppDatePicker({
  onValueChange,
  placeholder = 'Pick a date',
  value,
}: {
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  value?: Date;
}) {
  const [internal, setInternal] = useState<Date>();
  const selected = value ?? internal;
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button className={triggerClass} type="button">
            <CalendarDays className="size-4 text-muted-foreground" />
            <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
              {selected ? format(selected, 'dd MMM yyyy') : placeholder}
            </span>
          </button>
        }
      />
      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-auto overflow-visible rounded-lg border border-border bg-popover p-0 shadow-popover ring-0"
      >
        <Calendar
          className={calendarClass}
          mode="single"
          onSelect={(date) => {
            setInternal(date);
            onValueChange?.(date);
          }}
          selected={selected}
        />
      </PopoverContent>
    </Popover>
  );
}
export function AppDateRangePicker({
  className,
  onValueChange,
  placeholder = 'Pick a date range',
  value,
}: {
  className?: string;
  onValueChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  value?: DateRange;
}) {
  const [internal, setInternal] = useState<DateRange>();
  const selected = value ?? internal;
  const label = selected?.from
    ? selected.to
      ? `${format(selected.from, 'dd MMM yyyy')} – ${format(selected.to, 'dd MMM yyyy')}`
      : format(selected.from, 'dd MMM yyyy')
    : placeholder;
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button className={cn(triggerClass, className)} type="button">
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
            <span
              className={cn(
                'min-w-0 truncate',
                selected ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {label}
            </span>
          </button>
        }
      />
      <PopoverContent
        align="start"
        sideOffset={2}
        className="w-auto overflow-visible rounded-lg border border-border bg-popover p-0 shadow-popover ring-0"
      >
        <Calendar
          className={calendarClass}
          mode="range"
          numberOfMonths={2}
          onSelect={(range) => {
            setInternal(range);
            onValueChange?.(range);
          }}
          selected={selected}
        />
      </PopoverContent>
    </Popover>
  );
}
