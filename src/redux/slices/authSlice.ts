// frontend/src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api";
import {
  initializeSocket,
  disconnectSocket,
} from "../../services/socketService";

// Types
interface Permission {
  createTask: boolean;
  updateAnyTask: boolean;
  deleteAnyTask: boolean;
  assignTask: boolean;
  viewAllTasks: boolean;
  manageUsers: boolean;
}

interface User {
  id: string;
  username: string;
  email: string;
  role?: 'admin' | 'manager' | 'user';
  permissions?: Permission;
  createdAt?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  token: typeof window !== "undefined" ? sessionStorage.getItem("token") : null,
  user:
    typeof window !== "undefined"
      ? JSON.parse(sessionStorage.getItem("user") || "null")
      : null,
  isAuthenticated:
    typeof window !== "undefined" ? !!sessionStorage.getItem("token") : false,
  isLoading: false,
  error: null,
};

// Initialize socket if user is already authenticated
if (
  typeof window !== "undefined" &&
  initialState.token &&
  initialState.isAuthenticated
) {
  // We need to delay this slightly to ensure the Redux store is fully initialized
  setTimeout(() => {
    initializeSocket(initialState.token as string);
  }, 100);
}

// Async thunks
export const register = createAsyncThunk(
  "auth/register",
  async (
    userData: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.register(userData);
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Registration failed");
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authAPI.login(credentials);
      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Login failed");
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.logout();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch user data"
        );
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user data"
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      // Disconnect socket
      disconnectSocket();
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      register.fulfilled,
      (
        state,
        action: PayloadAction<{ token: string; user: User; success: boolean }>
      ) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        // Save to sessionStorage
        sessionStorage.setItem("token", action.payload.token);
        sessionStorage.setItem("user", JSON.stringify(action.payload.user));

        // Initialize socket connection with the token
        initializeSocket(action.payload.token);
      }
    );
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      login.fulfilled,
      (
        state,
        action: PayloadAction<{ token: string; user: User; success: boolean }>
      ) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        // Save to sessionStorage
        sessionStorage.setItem("token", action.payload.token);
        sessionStorage.setItem("user", JSON.stringify(action.payload.user));

        // Initialize socket connection with the token
        initializeSocket(action.payload.token);
      }
    );
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      // Clear sessionStorage
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Disconnect socket
      disconnectSocket();
    });
    builder.addCase(logoutUser.rejected, (state) => {
      state.isLoading = false;
      // Still logout on the client side even if the server request fails
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    });

    // Get current user
    builder.addCase(getCurrentUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      getCurrentUser.fulfilled,
      (state, action: PayloadAction<{ user: User; success: boolean }>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;

        // Update user in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    );
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.isLoading = false;
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      // Clear sessionStorage
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    });
  },
});

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;