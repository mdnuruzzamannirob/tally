'use client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';
export type AppButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
  tone?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'info' | 'link';
};
export function AppButton({
  children,
  className,
  loading,
  size = 'default',
  tone,
  variant: requestedVariant = 'default',
  ...props
}: AppButtonProps) {
  const selectedVariant = requestedVariant ?? 'default';
  const resolvedTone =
    tone ??
    ({
      default: 'primary',
      secondary: 'secondary',
      outline: 'outline',
      ghost: 'ghost',
      destructive: 'danger',
      link: 'link',
    } as const)[selectedVariant];
  const variant =
    resolvedTone === 'secondary'
      ? 'secondary'
      : resolvedTone === 'outline'
        ? 'outline'
        : resolvedTone === 'ghost'
          ? 'ghost'
          : resolvedTone === 'link'
            ? 'link'
            : 'default';
  const dimensions =
    size === 'xs'
      ? '!h-7 !px-2 text-xs'
      : size === 'icon-xs'
        ? '!size-7 !px-0'
        : size === 'icon-sm'
          ? '!size-8 !px-0'
          : size === 'icon'
            ? '!size-9 !px-0'
            : size === 'icon-lg'
              ? '!size-10 !px-0'
              : size === 'sm'
                ? '!h-8 !px-2.5'
                : size === 'lg'
                  ? '!h-10 !px-4'
                  : '!h-9 !px-3';
  return (
    <Button
      {...props}
      className={cn(
        dimensions,
        'rounded-md bg-clip-border font-medium transition-[transform,background-color,border-color,filter] active:scale-[.98]',
        resolvedTone === 'primary' &&
          'border-0! bg-clip-border ui-gradient-primary focus-visible:border-0! focus-visible:ring-0 hover:text-primary-foreground! hover:brightness-[.98]',
        resolvedTone === 'secondary' &&
          'border-border! bg-secondary! text-secondary-foreground hover:bg-muted! hover:text-foreground',
        resolvedTone === 'outline' &&
          'border-border! bg-card! text-foreground hover:bg-muted! hover:text-foreground',
        resolvedTone === 'ghost' && 'border-transparent! bg-transparent! hover:bg-muted!',
        resolvedTone === 'link' && 'h-auto! bg-transparent! px-0! text-primary hover:underline',
        resolvedTone === 'success' &&
          'border-0! ui-gradient-success hover:text-primary-foreground! hover:brightness-[.98]',
        resolvedTone === 'danger' &&
          'border-0! ui-gradient-danger focus-visible:border-0! focus-visible:ring-0 hover:text-primary-foreground! hover:brightness-[.98]',
        resolvedTone === 'info' &&
          'border-0! ui-gradient-info focus-visible:border-0! focus-visible:ring-0 hover:text-primary-foreground! hover:brightness-[.98]',
        className,
      )}
      disabled={props.disabled || loading}
      size={size}
      variant={variant}
    >
      {loading ? <LoaderCircle className="animate-spin" /> : null}
      {children}
    </Button>
  );
}
