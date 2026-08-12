import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
export type AppBadgeStatus = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type AppBadgeSize = 'sm' | 'md' | 'lg';
export function AppBadge({
  children,
  className,
  size = 'md',
  status = 'neutral',
}: {
  children: ReactNode;
  className?: string;
  size?: AppBadgeSize;
  status?: AppBadgeStatus;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-medium',
        { sm: 'px-1.5 py-0.5 text-[10px]', md: 'px-2 py-0.5 text-xs', lg: 'px-2.5 py-1 text-sm' }[
          size
        ],
        {
          neutral: 'bg-muted text-muted-foreground',
          info: 'bg-info-soft text-info',
          success: 'bg-success-soft text-success',
          warning: 'bg-warning-soft text-warning',
          danger: 'bg-danger-soft text-danger',
        }[status],
        className,
      )}
    >
      {children}
    </span>
  );
}
