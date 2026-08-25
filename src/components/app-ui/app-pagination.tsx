"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppButton } from "./app-button";
export function AppPagination({
  onPageChange,
  page,
  totalPages,
}: {
  onPageChange?: (page: number) => void;
  page: number;
  totalPages: number;
}) {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);
  return (
    <nav aria-label="Pagination" className="flex h-8 items-center gap-1">
      <AppButton
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
        size="icon-sm"
        tone="secondary"
      >
        <ChevronLeft />
      </AppButton>
      {pages.map((number) => (
        <button
          className={
            number === page
              ? "grid size-8 place-items-center rounded-md border border-primary bg-primary text-xs font-medium text-primary-foreground"
              : "grid size-8 place-items-center rounded-md border border-transparent text-xs font-medium text-muted-foreground hover:border-border hover:bg-muted"
          }
          key={number}
          onClick={() => onPageChange?.(number)}
          type="button"
        >
          {number}
        </button>
      ))}
      <AppButton
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange?.(page + 1)}
        size="icon-sm"
        tone="secondary"
      >
        <ChevronRight />
      </AppButton>
    </nav>
  );
}
