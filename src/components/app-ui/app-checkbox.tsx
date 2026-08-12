'use client';

import type { ComponentProps, ReactNode } from 'react';
import { useId } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export type AppCheckboxProps = Omit<ComponentProps<typeof Checkbox>, 'className' | 'id'> & {
  className?: string;
  description?: string;
  id?: string;
  label: ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

export function AppCheckbox({
  className,
  description,
  id,
  label,
  size = 'md',
  ...props
}: AppCheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  return (
    <label
      className={cn(
        'flex cursor-pointer select-none items-center gap-3 text-sm has-disabled:cursor-not-allowed has-disabled:opacity-60',
        description && 'items-start',
      )}
      htmlFor={checkboxId}
    >
      <Checkbox
        {...props}
        className={cn(
          { sm: 'size-4', md: 'size-5', lg: 'size-6' }[size],
          'rounded-sm border-border bg-card bg-clip-border ui-checked-gradient data-checked:border-0! focus-visible:border-0! focus-visible:ring-0',
          description && 'mt-0.5',
          className,
        )}
        id={checkboxId}
      />
      <span>
        <span
          className={cn(
            'block font-medium',
            { sm: 'text-xs leading-4', md: 'text-sm leading-5', lg: 'text-base leading-6' }[size],
          )}
        >
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
        ) : null}
      </span>
    </label>
  );
}
