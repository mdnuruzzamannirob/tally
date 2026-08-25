"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function AppOfflineBanner({
  message = "You’re offline. Changes cannot be saved until you reconnect.",
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
    <div className="mx-4 mt-3 flex items-center gap-2 rounded-md border border-warning-border border-l-3 bg-warning-soft px-3 py-2.5 text-sm text-warning-text sm:mx-6 lg:mx-8" role="status">
      <WifiOff aria-hidden="true" className="size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
