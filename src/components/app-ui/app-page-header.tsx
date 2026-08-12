import type { ReactNode } from 'react';
export function AppPageHeader({
  actions,
  breadcrumb,
  description,
  title,
}: {
  actions?: ReactNode;
  breadcrumb?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
}) {
  return (
    <header>
      {breadcrumb ? <div className="mb-3">{breadcrumb}</div> : null}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? (
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end [&>[data-slot=button]]:w-full sm:[&>[data-slot=button]]:w-auto">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
