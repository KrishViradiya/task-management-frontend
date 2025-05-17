"use client";

import { useEffect, useState } from "react";
import NotificationToast from "./NotificationToast";
import NotificationPermission from "./NotificationPermission";

export default function NotificationWrapper() {
  // Use client-side only rendering
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render on the client
  if (!isClient) {
    return null;
  }

  return (
    <>
      <NotificationToast />
      <NotificationPermission />
    </>
  );
}
