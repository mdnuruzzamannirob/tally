import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
export function AppAvatar({
  alt,
  className,
  fallback,
  size = 'md',
  src,
}: {
  alt: string;
  className?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
}) {
  return (
    <Avatar
      className={cn(
        {
          sm: 'size-7 text-[10px]',
          md: 'size-9 text-xs',
          lg: 'size-12 text-sm',
          xl: 'size-16 text-base',
        }[size],
        className,
      )}
    >
      <AvatarImage alt={alt} src={src} />
      <AvatarFallback className="bg-primary/10 font-medium text-primary">{fallback}</AvatarFallback>
    </Avatar>
  );
}
