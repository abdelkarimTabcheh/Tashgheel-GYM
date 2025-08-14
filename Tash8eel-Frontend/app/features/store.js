import { configureStore } from '@reduxjs/toolkit';
import workoutsReducer from './workoutsSlice';
import userReducer from './userSlice';
import authReducer from './authSlice';
import challengesReducer from '../features/challengesSlice';

const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    user: userReducer,
    auth: authReducer,
    challenges: challengesReducer,
  },
});

export default store;
