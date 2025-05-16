// frontend/src/redux/slices/taskSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskAPI } from '../../services/api';

// Types
export interface Collaborator {
  _id: string;
  username: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdBy: string;
  assignedTo?: string;
  collaborators?: Collaborator[];
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  createdTasks: Task[];
  assignedTasks: Task[];
  overdueTasks: Task[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  createdTasks: [],
  assignedTasks: [],
  overdueTasks: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAllTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getAllTasks();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getTaskById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await taskAPI.createTask(taskData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const inviteCollaborator = createAsyncThunk(
  'tasks/inviteCollaborator',
  async ({ taskId, email }: { taskId: string; email: string }, { rejectWithValue }) => {
    try {
      const response = await taskAPI.inviteCollaborator(taskId, email);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to invite collaborator');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, taskData }: { id: string; taskData: Partial<Task> }, { rejectWithValue }) => {
    try {
      const response = await taskAPI.updateTask(id, taskData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskAPI.deleteTask(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

export const fetchCreatedTasks = createAsyncThunk(
  'tasks/fetchCreated',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getCreatedTasks();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch created tasks');
    }
  }
);

export const fetchAssignedTasks = createAsyncThunk(
  'tasks/fetchAssigned',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getAssignedTasks();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assigned tasks');
    }
  }
);

export const fetchOverdueTasks = createAsyncThunk(
  'tasks/fetchOverdue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskAPI.getOverdueTasks();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch overdue tasks');
    }
  }
);

export const searchTasks = createAsyncThunk(
  'tasks/search',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await taskAPI.searchTasks(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search tasks');
    }
  }
);

// Task slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearTaskErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all tasks
    builder.addCase(fetchAllTasks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
      state.isLoading = false;
      state.tasks = action.payload;
    });
    builder.addCase(fetchAllTasks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch task by id
    builder.addCase(fetchTaskById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
      state.isLoading = false;
      state.currentTask = action.payload;
    });
    builder.addCase(fetchTaskById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create task
    builder.addCase(createTask.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
      state.isLoading = false;
      state.tasks.push(action.payload);
      state.createdTasks.push(action.payload);
    });
    builder.addCase(createTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update task
    builder.addCase(updateTask.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
      state.isLoading = false;
      // Update in main tasks array
      state.tasks = state.tasks.map(task => 
        task._id === action.payload._id ? action.payload : task
      );
      
      // Update in filtered arrays if present
      state.createdTasks = state.createdTasks.map(task => 
        task._id === action.payload._id ? action.payload : task
      );
      state.assignedTasks = state.assignedTasks.map(task => 
        task._id === action.payload._id ? action.payload : task
      );
      state.overdueTasks = state.overdueTasks.map(task => 
        task._id === action.payload._id ? action.payload : task
      );
      
      // Update current task if it's the one being edited
      if (state.currentTask && state.currentTask._id === action.payload._id) {
        state.currentTask = action.payload;
      }
    });
    builder.addCase(updateTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete task
    builder.addCase(deleteTask.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      // Remove from all arrays
      state.tasks = state.tasks.filter(task => task._id !== action.payload);
      state.createdTasks = state.createdTasks.filter(task => task._id !== action.payload);
      state.assignedTasks = state.assignedTasks.filter(task => task._id !== action.payload);
      state.overdueTasks = state.overdueTasks.filter(task => task._id !== action.payload);
      
      // Clear current task if it's the one being deleted
      if (state.currentTask && state.currentTask._id === action.payload) {
        state.currentTask = null;
      }
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch created tasks
    builder.addCase(fetchCreatedTasks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCreatedTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
      state.isLoading = false;
      state.createdTasks = action.payload;
    });
    builder.addCase(fetchCreatedTasks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch assigned tasks
    builder.addCase(fetchAssignedTasks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAssignedTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
      state.isLoading = false;
      state.assignedTasks = action.payload;
    });
    builder.addCase(fetchAssignedTasks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch overdue tasks
    builder.addCase(fetchOverdueTasks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOverdueTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
      state.isLoading = false;
      state.overdueTasks = action.payload;
    });
    builder.addCase(fetchOverdueTasks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Search tasks
    builder.addCase(searchTasks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(searchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
      state.isLoading = false;
      state.tasks = action.payload;
    });
    builder.addCase(searchTasks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Invite collaborator
    builder.addCase(inviteCollaborator.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(inviteCollaborator.fulfilled, (state, action: PayloadAction<Task>) => {
      state.isLoading = false;
      
      // Update in main tasks array
      state.tasks = state.tasks.map(task => 
        task._id === action.payload._id ? action.payload : task
      );
      
      // Update in filtered arrays if present
      state.createdTasks = state.createdTasks.map(task => 
        task._id === action.payload._id ? action.payload : task
      );
      state.assignedTasks = state.assignedTasks.map(task => 
        task._id === action.payload._id ? action.payload : task
      );
      state.overdueTasks = state.overdueTasks.map(task => 
        task._id === action.payload._id ? action.payload : task
      );
      
      // Update current task if it's the one being edited
      if (state.currentTask && state.currentTask._id === action.payload._id) {
        state.currentTask = action.payload;
      }
    });
    builder.addCase(inviteCollaborator.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentTask, clearTaskErrors } = taskSlice.actions;
export default taskSlice.reducer;