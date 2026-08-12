"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AppInput } from "./app-input";
import type { AppSelectOption } from "./app-select";
export function AppCombobox({
  onValueChange,
  options,
  placeholder = "Search and select",
  value,
}: {
  onValueChange?: (value: string | null) => void;
  options: readonly AppSelectOption[];
  placeholder?: string;
  value?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [internalValue, setInternalValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const currentValue = value === undefined ? internalValue : value;
  const selected = options.find((option) => option.value === currentValue);
  const filtered = useMemo(
    () =>
      options.filter((option) => String(option.label).toLowerCase().includes(query.toLowerCase())),
    [options, query],
  );
  const choose = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
    setQuery("");
    setOpen(false);
  };
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <button
            className="flex h-10 w-full items-center gap-2 rounded-md border border-border bg-background! px-3 text-sm outline-none transition-[color,border-color,box-shadow] duration-100 hover:border-border focus:border-primary focus:ring-3 focus:ring-primary/15 data-popup-open:border-primary data-popup-open:ring-3 data-popup-open:ring-primary/15"
            type="button"
          >
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-left",
                selected ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {selected?.label ?? placeholder}
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </button>
        }
      />
      <PopoverContent
        align="start"
        className="w-max min-w-(--anchor-width) max-w-[calc(100vw-2rem)] gap-1.5 rounded-lg border border-border p-0 ring-0 data-open:animate-none data-closed:animate-none"
      >
        <AppInput
          className="h-9! w-full rounded-none! border-0! border-b! border-border! bg-transparent! px-3! text-xs! shadow-none! outline-none! ring-0! focus-visible:border-0! focus-visible:border-b! focus-visible:border-b-border! focus-visible:ring-0!"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search..."
          value={query}
        />
        <div className="max-h-60 w-full space-y-1 overflow-y-auto p-2">
          {filtered.map((option) => (
            <button
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-primary/10",
                currentValue === option.value && "bg-primary/10 text-primary",
              )}
              key={option.value}
              onClick={() => choose(option.value)}
              type="button"
            >
              <span className="min-w-0 flex-1">{option.label}</span>
              {currentValue === option.value ? <Check className="size-4" /> : null}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
