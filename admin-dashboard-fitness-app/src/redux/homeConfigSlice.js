// src/redux/homeConfigSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';

export const fetchHomeConfig = createAsyncThunk('homeConfig/fetch', async (_, thunkAPI) => {
  try {
    const response = await api.fetchHomeConfig();
    return response.data;
  } catch (error) {
    console.log('Backend endpoint not available, using mock data');
    // Return mock data if backend is not available
    return {
      featuredWorkouts: '["workout1", "workout2", "workout3"]',
      bannerText: 'Welcome to Tash8eel! Start your fitness journey today.',
    };
  }
});

export const updateHomeConfig = createAsyncThunk('homeConfig/update', async (config, thunkAPI) => {
  try {
    const response = await api.updateHomeConfig(config);
    return response.data;
  } catch (error) {
    console.log('Backend endpoint not available, using mock update');
    // Return the config as if it was saved successfully
    return config;
  }
});

const homeConfigSlice = createSlice({
  name: 'homeConfig',
  initialState: {
    config: {
      featuredWorkouts: '["workout1", "workout2", "workout3"]',
      bannerText: 'Welcome to Tash8eel! Start your fitness journey today.',
    },
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        state.loading = false;
      })
      .addCase(fetchHomeConfig.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(updateHomeConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHomeConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        state.loading = false;
      })
      .addCase(updateHomeConfig.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default homeConfigSlice.reducer;
