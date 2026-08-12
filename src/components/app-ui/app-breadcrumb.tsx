import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
export type AppBreadcrumbItem = { href?: string; label: ReactNode };
export function AppBreadcrumb({ items }: { items: readonly AppBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li className="flex items-center gap-1.5" key={index}>
            {index > 0 && <ChevronRight className="size-3.5" />}

            {item.href ? (
              <Link className="hover:text-foreground" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
