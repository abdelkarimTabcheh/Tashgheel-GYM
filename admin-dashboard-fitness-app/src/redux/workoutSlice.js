// src/redux/workoutSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

// Fetch all workouts
export const fetchWorkouts = createAsyncThunk('workouts/fetchWorkouts', async () => {
  const response = await API.get('/admin/workouts');
  return response.data;
});

// Add a new workout
export const addWorkout = createAsyncThunk('workouts/addWorkout', async (workout) => {
  const response = await API.post('/admin/workouts', workout);
  return response.data;
});

// Edit workout
export const editWorkout = createAsyncThunk('workouts/editWorkout', async ({ id, workout }) => {
  const response = await API.put(`/admin/workouts/${id}`, workout);
  return response.data;
});

// Delete workout
export const deleteWorkout = createAsyncThunk('workouts/deleteWorkout', async (id) => {
  await API.delete(`/admin/workouts/${id}`);
  return id;
});

const workoutSlice = createSlice({
  name: 'workouts',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch workouts
      .addCase(fetchWorkouts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Add workout
      .addCase(addWorkout.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      
      // Edit workout
      .addCase(editWorkout.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex(w => w._id === updated._id);
        if (index !== -1) state.list[index] = updated;
      })
      
      // Delete workout
      .addCase(deleteWorkout.fulfilled, (state, action) => {
        state.list = state.list.filter(w => w._id !== action.payload);
      });
  },
});

export const { resetStatus } = workoutSlice.actions;
export default workoutSlice.reducer;