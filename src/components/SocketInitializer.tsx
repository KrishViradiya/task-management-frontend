"use client";

import { useEffect } from "react";
import { useAppSelector } from "../redux/store";
import { initializeSocket, isSocketConnected } from "../services/socketService";

/**
 * Component to initialize socket connection for authenticated users
 * This should be included in the app layout
 */
export default function SocketInitializer() {
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize socket connection if user is authenticated
    if (isAuthenticated && token) {
      console.log("Initializing socket connection for authenticated user");

      // Initialize socket immediately
      initializeSocket(token);

      // Set up a more frequent check initially to ensure connection
      const initialReconnectInterval = setInterval(() => {
        if (isAuthenticated && token && !isSocketConnected()) {
          console.log("Socket not connected, attempting to reconnect...");
          initializeSocket(token);
        } else {
          // Once connected, clear this interval
          clearInterval(initialReconnectInterval);
        }
      }, 2000); // Check every 2 seconds initially

      // Set up a longer interval for ongoing connection checks
      const reconnectInterval = setInterval(() => {
        if (isAuthenticated && token && !isSocketConnected()) {
          console.log("Socket not connected, attempting to reconnect...");
          initializeSocket(token);
        }
      }, 30000); // Check every 30 seconds

      return () => {
        clearInterval(initialReconnectInterval);
        clearInterval(reconnectInterval);
      };
    }
  }, [isAuthenticated, token]);

  // This component doesn't render anything
  return null;
}
