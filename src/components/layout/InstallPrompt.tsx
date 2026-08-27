"use client";

import { AppButton, toast } from "@/components/app-ui";
import { TallyLogo } from "@/components/shared/TallyLogo";
import { Download, Target, X } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt() {
  const [event, setEvent] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      localStorage.getItem("tally-install-dismissed") === "1"
    );
  });

  useEffect(() => {
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      localStorage.getItem("tally-install-dismissed") === "1"
    )
      return;
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
      toast.info(
        "To install Tally, open your browser menu and choose 'Install Tally' or 'Add to home screen'.",
      );
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
    <>
      <div className="relative hidden min-h-8 items-center justify-center border-b border-primary-border bg-primary-soft px-8 py-1 sm:flex">
        <div className="flex min-w-0 items-center gap-1.5">
          <TallyLogo className="text-sm" />
          <span aria-hidden="true" className="h-3 w-px bg-border-strong" />
          <span className="text-[10px] leading-3.5 text-foreground">
            Install Tally <span className="text-muted-foreground">for faster offline access</span>
          </span>
          <AppButton
            aria-label="Install Tally"
            className="h-5! px-1.5! text-[10px]! rounded"
            onClick={() => void install()}
            size="xs"
          >
            <Download className="size-3" />
            Install
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
      <div className="relative flex min-h-8 items-center border-b border-primary-border bg-primary-soft px-3 py-1 pr-10 sm:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <TallyLogo className="text-sm" />
          <span className="min-w-0 truncate text-[10px] leading-3.5 text-foreground">
            Install Tally <span className="text-muted-foreground">· offline access</span>
          </span>
        </div>
        <AppButton
          aria-label="Install Tally"
          className="absolute right-10 h-5! px-1.5! rounded text-[10px]!"
          onClick={() => void install()}
          size="xs"
        >
          <Download className="size-3" />
          Install
        </AppButton>
        <AppButton
          aria-label="Dismiss install prompt"
          className="absolute right-1 size-6! text-muted-foreground hover:bg-muted!"
          onClick={dismiss}
          size="icon-xs"
          tone="ghost"
        >
          <X className="size-3.5" />
        </AppButton>
      </div>
    </>
  );
}
