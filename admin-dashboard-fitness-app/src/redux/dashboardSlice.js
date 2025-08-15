import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', async (_, thunkAPI) => {
  try {
    // Fetch real data from multiple endpoints
    const [usersResponse, workoutsResponse, challengesResponse] = await Promise.all([
      API.get('/admin/users'),
      API.get('/admin/workouts'),
      API.get('/admin/challenges')
    ]);

    const users = usersResponse.data || [];
    const workouts = workoutsResponse.data || [];
    const challenges = challengesResponse.data || [];

    // Calculate real statistics
    const totalUsers = users.length;
    const totalWorkouts = workouts.length;
    const totalChallenges = challenges.length;
    
    // Calculate new users today (users created today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = users.filter(user => {
      const userDate = new Date(user.createdAt);
      userDate.setHours(0, 0, 0, 0);
      return userDate.getTime() === today.getTime();
    }).length;

    // Generate user activity for last 7 days
    const userActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const usersOnDate = users.filter(user => {
        const userDate = new Date(user.createdAt);
        return userDate.toISOString().split('T')[0] === dateStr;
      }).length;
      
      userActivity.push({
        date: dateStr,
        users: usersOnDate
      });
    }

    // Get popular workouts (mock for now, can be enhanced with real usage data)
    const popularWorkouts = workouts.slice(0, 5).map((workout, index) => ({
      id: workout._id,
      name: workout.name,
      count: Math.floor(Math.random() * 50) + 10 // Mock usage count
    }));

    // Calculate active sessions (mock for now)
    const activeSessions = Math.floor(Math.random() * 200) + 100;
    
    // Calculate workouts today (mock for now)
    const workoutsToday = Math.floor(Math.random() * 50) + 20;

    return {
      totalUsers,
      totalWorkouts,
      totalChallenges,
      activeSessions,
      workoutsToday,
      newUsersToday,
      categories: workouts.reduce((acc, workout) => {
        if (!acc.includes(workout.category)) acc.push(workout.category);
        return acc;
      }, []).length,
      userActivity,
      popularWorkouts
    };
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err);
    // Return fallback data if API fails
    return {
      totalUsers: 0,
      totalWorkouts: 0,
      totalChallenges: 0,
      activeSessions: 0,
      workoutsToday: 0,
      newUsersToday: 0,
      categories: 0,
      userActivity: [],
      popularWorkouts: []
    };
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
