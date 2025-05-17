// frontend/src/services/socketService.ts
import { io, Socket } from "socket.io-client";
import { store } from "../redux/store";
import { addNotification } from "../redux/slices/notificationSlice";
import { updateTask } from "../redux/slices/taskSlice";

// Define the base URL for the socket connection
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

let socket: Socket | null = null;

/**
 * Initialize the socket connection
 * @param token JWT token for authentication
 */
export const initializeSocket = (token: string) => {
  if (!token) {
    console.error("Cannot initialize socket without a token");
    return;
  }

  if (socket) {
    // If socket exists but disconnected, reconnect
    if (!socket.connected) {
      console.log("Reconnecting existing socket...");
      socket.connect();

      // Re-authenticate after reconnection
      socket.once("connect", () => {
        socket?.emit("authenticate", token);
        console.log("Re-authenticated socket after reconnection");
      });
    }
    return;
  }

  console.log("Creating new socket connection...");

  // Create new socket connection with reconnection options
  socket = io(SOCKET_URL, {
    autoConnect: true,
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  // Remove any existing listeners to prevent duplicates
  socket.removeAllListeners();

  // Socket connection event handlers
  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);

    // Authenticate the socket connection
    socket?.emit("authenticate", token);
  });

  // Handle authentication confirmation
  socket.on("authenticated", (response) => {
    if (response.success) {
      console.log(
        "Socket authenticated successfully for user:",
        response.userId
      );
    } else {
      console.error("Socket authentication failed:", response.error);
      // Try to reconnect with a delay
      setTimeout(() => {
        if (socket) {
          socket.connect();
        }
      }, 5000);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);

    // If the server disconnected us, try to reconnect
    if (reason === "io server disconnect") {
      socket?.connect();
    }
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`Socket reconnected after ${attemptNumber} attempts`);

    // Re-authenticate after reconnection
    socket?.emit("authenticate", token);
  });

  socket.on("reconnect_error", (error) => {
    console.error("Socket reconnection error:", error);
  });

  // Listen for notifications
  socket.on("notification", (notification) => {
    console.log("Received notification:", notification);

    // Add notification to Redux store
    try {
      // Make sure the notification has all required fields
      if (!notification._id) {
        console.error("Received notification without _id:", notification);
        return;
      }

      // Dispatch to Redux store with a slight delay to ensure UI updates
      setTimeout(() => {
        store.dispatch(addNotification(notification));
        console.log("Notification added to Redux store:", notification._id);
      }, 100);

      // Also show browser notification if supported
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("New Task Notification", {
          body: notification.message,
          icon: "/favicon.ico",
        });
      }
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  });

  // Listen for task updates
  socket.on("taskUpdate", (task) => {
    console.log("Received task update:", task);
    try {
      store.dispatch(updateTask(task));
    } catch (error) {
      console.error("Error handling task update:", error);
    }
  });
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected manually");
  }
};

/**
 * Get the current socket instance
 * @returns The socket instance or null if not initialized
 */
export const getSocket = () => socket;

/**
 * Check if the socket is connected
 * @returns True if the socket is connected, false otherwise
 */
export const isSocketConnected = () => {
  return socket?.connected || false;
};

/**
 * Request permission for browser notifications
 * @returns Promise that resolves with the permission status
 */
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notifications");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};
