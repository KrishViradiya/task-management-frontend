// frontend/src/redux/slices/notificationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { notificationAPI } from '../../services/api';

// Types
export interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: 'task_assigned' | 'task_updated' | 'task_completed' | 'task_overdue' | 'system';
  read: boolean;
  relatedTaskId?: string;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.getNotifications();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.markAsRead(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.markAllAsRead();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/unreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.getUnreadCount();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

// Notification slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotificationErrors: (state) => {
      state.error = null;
    },
    // For handling real-time notification
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder.addCase(fetchNotifications.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
      state.isLoading = false;
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(notification => !notification.read).length;
    });
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Mark as read
    builder.addCase(markAsRead.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(markAsRead.fulfilled, (state, action: PayloadAction<Notification>) => {
      state.isLoading = false;
      state.notifications = state.notifications.map(notification => 
        notification._id === action.payload._id ? action.payload : notification
      );
      state.unreadCount = state.notifications.filter(notification => !notification.read).length;
    });
    builder.addCase(markAsRead.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Mark all as read
    builder.addCase(markAllAsRead.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(markAllAsRead.fulfilled, (state) => {
      state.isLoading = false;
      state.notifications = state.notifications.map(notification => ({
        ...notification,
        read: true
      }));
      state.unreadCount = 0;
    });
    builder.addCase(markAllAsRead.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch unread count
    builder.addCase(fetchUnreadCount.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUnreadCount.fulfilled, (state, action: PayloadAction<{ count: number }>) => {
      state.isLoading = false;
      state.unreadCount = action.payload.count;
    });
    builder.addCase(fetchUnreadCount.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearNotificationErrors, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;