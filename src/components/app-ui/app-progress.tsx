import { cn } from '@/lib/utils';
export function AppProgress({
  className,
  label,
  tone = 'primary',
  value,
}: {
  className?: string;
  label?: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
  value: number;
}) {
  const safe = Math.min(100, Math.max(0, value));
  return (
    <div className={className}>
      {label ? (
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">{safe}%</span>
        </div>
      ) : null}
      <div
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={safe}
        className="h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width]',
            {
              primary: 'ui-gradient-primary',
              success: 'ui-gradient-success',
              warning: 'ui-gradient-warning',
              danger: 'ui-gradient-danger',
            }[tone],
          )}
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}
