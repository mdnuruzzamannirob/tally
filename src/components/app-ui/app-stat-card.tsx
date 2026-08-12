import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
export function AppStatCard({
  change,
  icon,
  label,
  tone = 'primary',
  variant = 'default',
  value,
}: {
  change?: ReactNode;
  icon: ReactNode;
  label: ReactNode;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  variant?: 'default' | 'compact' | 'featured';
  value: ReactNode;
}) {
  return (
    <article
      className={cn(
        'rounded-lg border border-border',
        {
          default: 'bg-card p-4',
          compact: 'bg-card p-3',
          featured: 'border-primary ui-gradient-primary p-4',
        }[variant],
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'grid size-9 place-items-center rounded-md [&>svg]:size-4',
            {
              primary:
                variant === 'featured'
                  ? 'bg-primary-foreground/15 text-primary-foreground'
                  : 'ui-gradient-primary',
              success:
                variant === 'featured'
                  ? 'bg-primary-foreground/15 text-primary-foreground'
                  : 'ui-gradient-success',
              warning:
                variant === 'featured'
                  ? 'bg-primary-foreground/15 text-primary-foreground'
                  : 'ui-gradient-warning',
              danger:
                variant === 'featured'
                  ? 'bg-primary-foreground/15 text-primary-foreground'
                  : 'ui-gradient-danger',
              info:
                variant === 'featured'
                  ? 'bg-primary-foreground/15 text-primary-foreground'
                  : 'ui-gradient-info',
            }[tone],
          )}
        >
          {icon}
        </span>
        {change ? (
          <span
            className={cn(
              'text-xs font-medium',
              variant === 'featured' ? 'text-primary-foreground/80' : 'text-muted-foreground',
            )}
          >
            {change}
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          'mt-4 text-sm',
          variant === 'featured' ? 'text-primary-foreground/80' : 'text-muted-foreground',
        )}
      >
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
    </article>
  );
}
