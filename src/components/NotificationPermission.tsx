"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/store";
import { requestNotificationPermission } from "../services/socketService";

export default function NotificationPermission() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only show the prompt for authenticated users
    if (
      isAuthenticated &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      setShowPrompt(true);
    }
  }, [isAuthenticated]);

  const handleRequestPermission = async () => {
    const permission = await requestNotificationPermission();
    setShowPrompt(false);

    if (permission === "granted") {
      // Show a test notification
      new Notification("Notifications Enabled", {
        body: "You will now receive real-time notifications for your tasks.",
        icon: "/favicon.ico",
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-50 animate-fade-in-up">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            Enable Notifications
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Would you like to receive real-time notifications for your tasks?
          </p>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleRequestPermission}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Enable
            </button>
            <button
              onClick={handleDismiss}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
