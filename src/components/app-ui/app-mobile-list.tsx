import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AppMobileListProps<T> = {
  className?: string;
  empty?: ReactNode;
  getItemKey: (item: T) => string | number;
  items: readonly T[];
  renderItem: (item: T) => ReactNode;
};

/** Stacked mobile data display that shares the same empty-state contract as AppTable. */
export function AppMobileList<T>({
  className,
  empty = "No records found",
  getItemKey,
  items,
  renderItem,
}: AppMobileListProps<T>) {
  return (
    <div className={cn("divide-y divide-border overflow-hidden rounded-lg border border-border bg-card", className)}>
      {items.length ? (
        items.map((item) => (
          <div className="p-4" key={getItemKey(item)}>
            {renderItem(item)}
          </div>
        ))
      ) : (
        <div className="px-4 py-10 text-center text-sm text-muted-foreground">{empty}</div>
      )}
    </div>
  );
}
