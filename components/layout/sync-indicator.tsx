"use client";

import { useEffect, useState } from "react";

export function SyncIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(window.navigator.onLine);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 top-[calc(env(safe-area-inset-top)+0.75rem)] z-50 rounded-2xl bg-[#172B4D] px-4 py-3 text-center text-sm font-medium text-white shadow-2xl lg:left-auto lg:right-6 lg:w-80">
      Offline mode. Changes may need retry after reconnecting.
    </div>
  );
}
