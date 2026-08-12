'use client';
import type { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function AppSheet({
  bodyClassName,
  children,
  contentClassName,
  description,
  footer,
  footerClassName,
  headerClassName,
  side = 'right',
  title,
  ...props
}: React.ComponentProps<typeof Sheet> & {
  bodyClassName?: string;
  children: ReactNode;
  contentClassName?: string;
  description?: ReactNode;
  footer?: ReactNode;
  footerClassName?: string;
  headerClassName?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  title: ReactNode;
}) {
  return (
    <Sheet {...props}>
      <SheetContent className={cn('border-border shadow-none!', contentClassName)} side={side}>
        <SheetHeader className={cn('min-w-0 pr-16', headerClassName)}>
          <SheetTitle className="min-w-0 text-lg leading-6 wrap-break-word">{title}</SheetTitle>
          {description ? (
            <SheetDescription className="text-sm leading-5 wrap-break-word">
              {description}
            </SheetDescription>
          ) : null}
        </SheetHeader>
        <div className={cn('min-h-0 flex-1 overflow-y-auto px-6 py-5', bodyClassName)}>
          {children}
        </div>
        {footer ? (
          <SheetFooter className={cn('border-t border-border bg-secondary', footerClassName)}>
            {footer}
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
