"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
export type AppTabItem = {
  content: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  value: string;
};
export function AppTabs({
  className,
  defaultValue,
  value,
  items,
  onValueChange,
  variant = "line",
  width = "full",
}: {
  className?: string;
  defaultValue?: string;
  value?: string;
  items: readonly AppTabItem[];
  onValueChange?: (value: string) => void;
  variant?: "line" | "box";
  width?: "full" | "fit";
}) {
  return (
    <Tabs
      className={className}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={onValueChange}
      value={value}
    >
      <TabsList
        className={cn(
          "grid w-full grid-flow-col shadow-none",
          width === "full" ? "auto-cols-fr" : "auto-cols-max",
          width === "fit" ? "justify-start!" : "",
          variant === "line"
            ? "h-auto! rounded-none! border-0! border-b! border-border bg-transparent! p-0!"
            : "h-10! rounded-md! border border-border! bg-background! p-1!",
        )}
        style={
          width === "full"
            ? { gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }
            : undefined
        }
      >
        {items.map((item) => (
          <TabsTrigger
            className={cn(
              "min-h-0 min-w-0 text-sm leading-none shadow-none!",
              width === "fit" ? "flex-none!" : "",
              variant === "line"
                ? "h-10! rounded-none! border-0! border-b-2! border-transparent! bg-transparent! px-3! py-2! text-muted-foreground hover:bg-transparent! hover:text-foreground! data-active:border-primary! data-active:bg-transparent! data-active:text-primary! data-active:shadow-none! data-active:hover:border-primary! data-active:hover:bg-transparent! data-active:hover:text-primary!"
                : "h-full! rounded-sm! border! border-transparent! bg-transparent! px-3! py-0! text-muted-foreground! hover:text-foreground! hover:font-medium data-active:border-transparent! data-active:bg-primary-subtle! data-active:font-medium data-active:text-primary! data-active:hover:border-transparent! data-active:hover:bg-primary-subtle! data-active:hover:text-primary!",
            )}
            disabled={item.disabled}
            key={item.value}
            value={item.value}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) =>
        item.content ? (
          <TabsContent className="pt-4" key={item.value} value={item.value}>
            {item.content}
          </TabsContent>
        ) : null,
      )}
    </Tabs>
  );
}
