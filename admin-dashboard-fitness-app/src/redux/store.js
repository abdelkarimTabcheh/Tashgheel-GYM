// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice';
import exerciseReducer from './exerciseSlice';
import homeConfigReducer from './homeConfigSlice';
import workoutReducer from './workoutSlice'; // Add this
import challengeReducer from './challengeSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    auth: authReducer,
    exercises: exerciseReducer,
    homeConfig: homeConfigReducer,
    workouts: workoutReducer, // Add this
    challenges: challengeReducer,
    dashboard: dashboardReducer,
  },
});