"use client";

import { useEffect, useState } from "react";

export function NotificationToast({ message }: { message?: string }) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) {
      return;
    }

    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 4000);
    return () => window.clearTimeout(timeout);
  }, [message]);

  if (!message || !visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 top-[calc(env(safe-area-inset-top)+1rem)] z-50 rounded-3xl bg-[#172B4D] px-4 py-3 text-sm font-medium text-white shadow-2xl lg:left-auto lg:right-6 lg:w-96">
      {message}
    </div>
  );
}
