"use client";

import { ReactNode } from "react";
import NotificationToast from "./NotificationToast";
import NotificationPermission from "./NotificationPermission";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NotificationToast />
      <NotificationPermission />
      {children}
    </>
  );
}
