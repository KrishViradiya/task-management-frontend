// frontend/src/config.ts

// API configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Socket.io configuration
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || API_BASE_URL;

// App configuration
export const APP_NAME = "TaskFlow";
export const APP_VERSION = "1.0.0";

// Feature flags
export const FEATURES = {
  NOTIFICATIONS: true,
  REAL_TIME_UPDATES: true,
  RBAC: true,
  RECURRING_TASKS: false,
  OFFLINE_SUPPORT: false,
  ANALYTICS: false,
};
