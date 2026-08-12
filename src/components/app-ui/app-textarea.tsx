import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
export type AppTextareaProps = React.ComponentProps<typeof Textarea>;
export function AppTextarea({ className, ...props }: AppTextareaProps) {
  return (
    <Textarea
      {...props}
      className={cn(
        'min-h-28 rounded-md border border-border bg-background! shadow-none transition-[color,border-color,box-shadow] duration-100 hover:border-border focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 aria-invalid:border-destructive! aria-invalid:focus-visible:border-destructive! aria-invalid:focus-visible:ring-4 aria-invalid:focus-visible:ring-destructive/10 disabled:cursor-not-allowed',
        className,
      )}
    />
  );
}
