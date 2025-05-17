// frontend/src/services/api.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token as fallback
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 error (unauthorized)
    if (error.response && error.response.status === 401) {
      // Just clear the token, don't redirect (let the components handle redirection)
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: { username: string; email: string; password: string }) =>
    api.post("/auth/register", userData),

  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),

  logout: () => api.post("/auth/logout"),

  getCurrentUser: () => api.get("/auth/me"),
};

// Task API
export const taskAPI = {
  createTask: (taskData: any) => {
    // If collaboratorEmails is provided, move it to collaborators
    if (taskData.collaboratorEmails) {
      taskData.collaborators = taskData.collaboratorEmails;
      delete taskData.collaboratorEmails;
    }
    return api.post("/tasks", taskData);
  },

  getAllTasks: () => api.get("/tasks"),

  getTaskById: (id: string) => api.get(`/tasks/${id}`),

  updateTask: (id: string, taskData: any) => api.put(`/tasks/${id}`, taskData),

  deleteTask: (id: string) => api.delete(`/tasks/${id}`),

  getCreatedTasks: () => api.get("/tasks/filter/created"),

  getAssignedTasks: () => api.get("/tasks/filter/assigned"),

  getOverdueTasks: () => api.get("/tasks/filter/overdue"),

  searchTasks: (params: any) => api.get("/tasks/search", { params }),

  inviteCollaborator: (taskId: string, email: string) =>
    api.post("/tasks/invite", { taskId, email }),
};

// Notification API
export const notificationAPI = {
  getNotifications: () => api.get("/notifications"),

  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),

  markAllAsRead: () => api.put("/notifications/read-all"),

  getUnreadCount: () => api.get("/notifications/unread/count"),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get("/admin/users"),

  getUserById: (id: string) => api.get(`/admin/users/${id}`),

  updateUserRole: (id: string, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),

  updateUserPermissions: (id: string, permissions: any) =>
    api.put(`/admin/users/${id}/permissions`, { permissions }),

  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
};

export default api;
