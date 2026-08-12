import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
export function AppSkeleton({ className, ...props }: React.ComponentProps<typeof Skeleton>) {
  return <Skeleton {...props} className={cn('rounded-md', className)} />;
}
export function AppCardSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border p-5">
      <div className="flex items-center gap-3">
        <AppSkeleton className="size-10" />
        <div className="flex-1 space-y-2">
          <AppSkeleton className="h-3 w-1/3" />
          <AppSkeleton className="h-3 w-2/3" />
        </div>
      </div>
      <AppSkeleton className="h-8 w-1/2" />
      <AppSkeleton className="h-2 w-full" />
    </div>
  );
}
