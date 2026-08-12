import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function AppEmptyState({
  action,
  className,
  description,
  icon,
  title,
}: {
  action?: ReactNode;
  className?: string;
  description?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
}) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}
    >
      {icon ? (
        <span className="grid size-11 place-items-center rounded-lg bg-muted text-muted-foreground [&>svg]:size-5">
          {icon}
        </span>
      ) : null}
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
