import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
export type AppTableColumn<T> = {
  align?: 'left' | 'right';
  header: ReactNode;
  key: string;
  render: (row: T) => ReactNode;
};
export function AppTable<T>({
  className,
  columns,
  empty = 'No records found',
  getRowKey,
  rows,
}: {
  className?: string;
  columns: readonly AppTableColumn<T>[];
  empty?: ReactNode;
  getRowKey: (row: T) => string | number;
  rows: readonly T[];
}) {
  return (
    <div className={cn('overflow-hidden bg-card text-card-foreground', className)}>
      <div className="overflow-x-auto">
        <Table className="min-w-180">
          <TableHeader className="border-b border-border/70 bg-muted/40">
            <TableRow className="border-b border-border/70 hover:bg-transparent">
              {columns.map((column, index) => (
                <TableHead
                  className={cn(
                    'h-auto px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground',
                    index === 0 && 'pl-5',
                    column.align === 'right' && 'text-right',
                  )}
                  key={column.key}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  className="border-b border-border/55 transition-colors last:border-b-0 hover:bg-muted/45"
                  key={getRowKey(row)}
                >
                  {columns.map((column, index) => (
                    <TableCell
                      className={cn(
                        'px-4 py-3.5 text-sm',
                        index === 0 && 'pl-5',
                        column.align === 'right' && 'text-right',
                      )}
                      key={column.key}
                    >
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-28 text-center text-sm text-muted-foreground"
                  colSpan={columns.length}
                >
                  {empty}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
