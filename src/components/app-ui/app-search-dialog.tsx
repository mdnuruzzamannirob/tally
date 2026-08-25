"use client";

import { ArrowUpRight, Briefcase, Clock3, FileText, Search } from "lucide-react";
import { AppInput } from "./app-input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export function AppSearchDialog({
  onOpenChange,
  open,
}: {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="top-16! translate-y-0! gap-0 overflow-hidden rounded-lg border-border bg-card p-0 shadow-xl sm:top-20!">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-5 shrink-0 text-primary" />
          <AppInput
            autoFocus
            aria-label="Search applications"
            className="h-13 border-0! bg-transparent! px-0 text-sm shadow-none focus-visible:ring-0"
            placeholder="Search applications, companies, notes..."
          />
          <kbd className="shrink-0 rounded-sm border border-border bg-muted/50 px-1.5 py-1 text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="p-2">
          <p className="px-2 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Quick search
          </p>
          <div className="space-y-0.5">
            <button
              className="group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              type="button"
            >
              <span className="grid size-8 place-items-center rounded-md bg-primary/10 text-primary">
                <Briefcase className="size-4" />
              </span>
              <span className="flex-1">
                <span className="block font-medium text-foreground">Applications</span>
                <span className="text-xs">Search your saved applications</span>
              </span>
              <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
            <button
              className="group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              type="button"
            >
              <span className="grid size-8 place-items-center rounded-md bg-info-soft text-info">
                <FileText className="size-4" />
              </span>
              <span className="flex-1">
                <span className="block font-medium text-foreground">Notes and interviews</span>
                <span className="text-xs">Find notes, companies, and interview details</span>
              </span>
              <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock3 className="size-3.5" /> Search across Tally
          </span>
          <span>Press Enter to open</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
