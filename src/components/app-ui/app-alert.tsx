import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
export type AppAlertTone = 'info' | 'success' | 'warning' | 'danger';
export type AppAlertSize = 'sm' | 'md' | 'lg';
export function AppAlert({
  children,
  size = 'md',
  title,
  tone = 'info',
}: {
  children?: ReactNode;
  size?: AppAlertSize;
  title: ReactNode;
  tone?: AppAlertTone;
}) {
  const Icon = { info: Info, success: CheckCircle2, warning: TriangleAlert, danger: AlertCircle }[
    tone
  ];
  return (
    <div
      className={cn(
        'flex rounded-md border',
        { sm: 'gap-2 p-2.5', md: 'gap-3 p-3.5', lg: 'gap-4 p-5' }[size],
        {
          info: 'border-info/20 bg-info-soft text-info',
          success: 'border-success/20 bg-success-soft text-success',
          warning: 'border-warning/20 bg-warning-soft text-warning',
          danger: 'border-danger/20 bg-danger-soft text-danger',
        }[tone],
      )}
    >
      <Icon className={cn('mt-0.5 shrink-0', { sm: 'size-4', md: 'size-5', lg: 'size-6' }[size])} />
      <div>
        <p className={cn('font-medium', { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }[size])}>
          {title}
        </p>
        {children ? (
          <div
            className={cn(
              'mt-0.5 opacity-80',
              { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }[size],
            )}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
