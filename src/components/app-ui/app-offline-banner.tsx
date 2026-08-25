"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function AppOfflineBanner({
  message = "You’re offline. Changes won’t be saved until you reconnect.",
  online: onlineOverride,
}: {
  message?: string;
  online?: boolean;
}) {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    addEventListener("online", sync);
    addEventListener("offline", sync);
    return () => {
      removeEventListener("online", sync);
      removeEventListener("offline", sync);
    };
  }, []);

  if (onlineOverride ?? online) return null;

  return (
    <div className="flex min-h-7 items-center justify-center gap-1.5 border-b border-warning-border bg-warning-soft px-3 py-1 text-[10px] leading-3.5 text-warning-text" role="status">
      <WifiOff aria-hidden="true" className="size-3 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
