import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
export function AppAvatar({
  alt,
  className,
  fallback,
  size = "md",
  src,
}: {
  alt: string;
  className?: string;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
  src?: string;
}) {
  return (
    <Avatar
      className={cn(
        "overflow-hidden rounded-full bg-primary after:hidden",
        {
          sm: "size-7 text-[10px]",
          md: "size-9 text-xs",
          lg: "size-12 text-sm",
          xl: "size-16 text-base",
        }[size],
        className,
      )}
    >
      <AvatarImage alt={alt} src={src} />
      <AvatarFallback
        className={cn(
          "inline-flex items-center justify-center bg-primary font-semibold leading-none tracking-wide text-primary-foreground",
          {
            sm: "text-[10px]",
            md: "text-xs",
            lg: "text-sm",
            xl: "text-base",
          }[size],
        )}
      >
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}
