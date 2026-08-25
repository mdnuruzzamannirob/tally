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
        'rounded-md bg-clip-border font-medium transition-[transform,background-color,border-color,filter] active:scale-[.98] disabled:cursor-not-allowed',
        resolvedTone === 'primary' &&
          'border-primary! bg-primary! text-primary-foreground hover:bg-primary-hover! hover:text-primary-foreground',
        resolvedTone === 'secondary' &&
          'border-border! bg-secondary! text-secondary-foreground hover:bg-muted! hover:text-foreground',
        resolvedTone === 'outline' &&
          'border-border! bg-card! text-foreground hover:bg-muted! hover:text-foreground',
        resolvedTone === 'ghost' && 'border-transparent! bg-transparent! hover:bg-muted!',
        resolvedTone === 'link' && 'h-auto! bg-transparent! px-0! text-primary hover:underline',
        resolvedTone === 'success' &&
          'border-success! bg-success! text-white hover:bg-success-hover!',
        resolvedTone === 'danger' &&
          'border-danger! bg-danger! text-white hover:bg-danger-hover!',
        resolvedTone === 'info' &&
          'border-info! bg-info! text-white hover:bg-info-hover!',
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
