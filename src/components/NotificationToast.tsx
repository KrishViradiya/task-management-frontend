"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../redux/store";
import { Notification, markAsRead } from "../redux/slices/notificationSlice";
import { AnimatePresence, motion } from "framer-motion";

export default function NotificationToast() {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => state.notifications);
  const [activeNotification, setActiveNotification] =
    useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);

  // Track notification count changes
  useEffect(() => {
    console.log(
      "Notifications state changed:",
      notifications.length,
      "notifications"
    );

    const unreadNotifications = notifications.filter(
      (notification) => !notification.read
    );

    console.log("Unread notifications:", unreadNotifications.length);

    // Check if we have new notifications
    if (unreadNotifications.length > lastNotificationCount) {
      console.log("New notification detected!");
      setLastNotificationCount(unreadNotifications.length);

      // Only show if we're not already showing a notification
      if (!isVisible) {
        // Get the most recent notification
        const latestNotification = unreadNotifications[0];
        console.log("Setting active notification:", latestNotification);

        setActiveNotification(latestNotification);
        setIsVisible(true);

        // Auto-hide after 5 seconds
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 5000);

        return () => clearTimeout(timer);
      }
    } else {
      // Update the count
      setLastNotificationCount(unreadNotifications.length);
    }
  }, [notifications, isVisible, lastNotificationCount]);

  // Handle animation complete (when toast is hidden)
  const handleAnimationComplete = () => {
    if (!isVisible && activeNotification) {
      setActiveNotification(null);
    }
  };

  // Handle marking notification as read
  const handleMarkAsRead = () => {
    if (activeNotification) {
      dispatch(markAsRead(activeNotification._id));
      setIsVisible(false);
    }
  };

  // Handle dismissing the notification
  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Handle clicking the notification (navigate to related task)
  const handleClick = () => {
    if (activeNotification?.task?._id || activeNotification?.relatedTaskId) {
      // Navigate to the task
      const taskId =
        activeNotification?.task?._id || activeNotification?.relatedTaskId;
      window.location.href = `/tasks/${taskId}`;
    }
    handleMarkAsRead();
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_assigned":
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        );
      case "task_updated":
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-yellow-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
        );
      case "task_completed":
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "task_overdue":
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isVisible && activeNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={handleAnimationComplete}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md w-full">
            <div className="flex items-start">
              {getNotificationIcon(activeNotification.type)}
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activeNotification.message}
                </p>
                <div className="mt-1 flex justify-between">
                  <button
                    onClick={handleClick}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    View details
                  </button>
                  <button
                    onClick={handleMarkAsRead}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Mark as read
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
