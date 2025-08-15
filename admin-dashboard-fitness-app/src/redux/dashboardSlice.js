import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', async (_, thunkAPI) => {
  try {
    // For now, return mock data. You can replace with actual API calls later
    const mockStats = {
      totalUsers: 1250,
      totalExercises: 89,
      activeSessions: 342,
      workoutsToday: 156,
      newUsersToday: 23,
      categories: 12,
      userActivity: [
        { date: '2024-01-01', users: 120 },
        { date: '2024-01-02', users: 135 },
        { date: '2024-01-03', users: 142 },
        { date: '2024-01-04', users: 128 },
        { date: '2024-01-05', users: 156 },
        { date: '2024-01-06', users: 168 },
        { date: '2024-01-07', users: 175 },
      ],
      popularExercises: [
        { id: 1, name: 'Push-ups', count: 45 },
        { id: 2, name: 'Squats', count: 38 },
        { id: 3, name: 'Plank', count: 32 },
        { id: 4, name: 'Burpees', count: 28 },
        { id: 5, name: 'Lunges', count: 25 },
      ]
    };
    
    return mockStats;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard stats');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
