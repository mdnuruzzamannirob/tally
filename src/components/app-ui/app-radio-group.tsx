'use client';
import type { ReactNode } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
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
    <RadioGroup {...props} className={cn('gap-2', className)}>
      {options.map((option) => (
        <label
          className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 has-data-checked:border-primary has-data-checked:bg-primary/5"
          key={option.value}
        >
          <RadioGroupItem
            className="ui-checked-gradient mt-0.5 border-border bg-card data-checked:border-0! focus-visible:border-0! focus-visible:ring-0"
            disabled={option.disabled}
            value={option.value}
          />
          <span>
            <span className="block text-sm font-medium">{option.label}</span>
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
