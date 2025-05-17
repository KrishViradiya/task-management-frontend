import { ReactNode } from "react";
import { ReduxProvider } from "../providers/ReduxProvider";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";

export const metadata = {
  title: "Task Management System",
  description:
    "A powerful task management system to help you organize, track, and complete your projects with ease.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ReduxProvider>
          <ClientLayout>{children}</ClientLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
