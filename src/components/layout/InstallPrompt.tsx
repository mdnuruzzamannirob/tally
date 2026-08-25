"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AppButton, toast } from "@/components/app-ui";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [event, setEvent] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(display-mode: standalone)").matches || localStorage.getItem("tally-install-dismissed") === "1";
  });

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches || localStorage.getItem("tally-install-dismissed") === "1") return;
    const onBeforeInstallPrompt = (nextEvent: Event) => {
      nextEvent.preventDefault();
      setEvent(nextEvent as InstallPromptEvent);
    };
    const onInstalled = () => setEvent(null);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (dismissed) return null;

  const install = async () => {
    if (!event) {
      toast.info("To install Tally, open your browser menu and choose ‘Install Tally’ or ‘Add to home screen’.");
      return;
    }
    await event.prompt();
    const choice = await event.userChoice;
    if (choice.outcome === "accepted") setEvent(null);
  };
  const dismiss = () => {
    localStorage.setItem("tally-install-dismissed", "1");
    setDismissed(true);
  };

  return (
    <div className="relative flex min-h-10 items-center justify-center border-b border-primary-border bg-primary-soft px-12 py-1.5">
      <div className="flex min-w-0 items-center justify-center gap-2">
        <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          <Download className="size-3" />
        </span>
        <p className="text-xs font-medium text-foreground">
          Install Tally{" "}
          <span className="hidden font-normal text-muted-foreground sm:inline">
            for faster offline access.
          </span>
        </p>
        <AppButton aria-label="Add Tally to your device" className="h-6! px-2! text-primary hover:bg-primary/10!" onClick={() => void install()} size="xs" tone="ghost">
          <Download className="size-3.5" />
          <span className="hidden sm:inline">Add to device</span>
          <span className="sm:hidden">Add</span>
        </AppButton>
      </div>

      <AppButton
        aria-label="Dismiss install prompt"
        className="absolute right-3 size-6! text-muted-foreground hover:bg-muted!"
        onClick={dismiss}
        size="icon-xs"
        tone="ghost"
      >
        <X className="size-3.5" />
      </AppButton>
    </div>
  );
}
