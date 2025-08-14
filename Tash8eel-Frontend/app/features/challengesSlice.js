// features/challengesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL_JO } from '../../config';

const API = `${API_BASE_URL_JO}/api/challenges`;

export const fetchChallenges = createAsyncThunk(
  'challenges/fetchChallenges',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch challenges');
    }
  }
);

export const fetchChallengeDetail = createAsyncThunk(
  'challenges/fetchDetail',
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/${id}?userId=${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch challenge detail');
    }
  }
);

export const startChallenge = createAsyncThunk(
  'challenges/start',
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/${id}/start`, { userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start challenge');
    }
  }
);

// 🔥 UPDATED: Complete day with streak integration and proper auth
export const completeDay = createAsyncThunk(
  'challenges/completeDay',
  async ({ id, day }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      const response = await axios.put(
        `${API_BASE_URL_JO}/api/challenges/${id}/complete-day`, // Updated endpoint
        { day },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to complete day');
    }
  }
);

const slice = createSlice({
  name: 'challenges',
  initialState: {
    list: [],
    detail: null,
    progress: null,
    status: 'idle',
    error: null,
    // 🔥 NEW: Streak-related state
    lastStreakUpdate: null,
    dayCompletionStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    completionError: null,
  },
  reducers: {
    // Clear challenge detail when navigating away
    clearChallengeDetail: (state) => {
      state.detail = null;
      state.progress = null;
    },
    // Reset error state
    resetError: (state) => {
      state.error = null;
      state.completionError = null;
    },
    // 🔥 NEW: Reset day completion status
    resetDayCompletionStatus: (state) => {
      state.dayCompletionStatus = 'idle';
      state.completionError = null;
    }
  },
  extraReducers: builder =>
    builder
      // Fetch challenges
      .addCase(fetchChallenges.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch challenge detail
      .addCase(fetchChallengeDetail.pending, state => {
        state.status = 'loading';
        state.detail = null;
        state.progress = null;
        state.error = null;
      })
      .addCase(fetchChallengeDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.detail = action.payload.challenge;
        state.progress = action.payload.progress;
        state.error = null;
      })
      .addCase(fetchChallengeDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Start challenge
      .addCase(startChallenge.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(startChallenge.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.progress = action.payload.progress || action.payload;
        state.error = null;
      })
      .addCase(startChallenge.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // 🔥 UPDATED: Complete day with streak handling
      .addCase(completeDay.pending, (state) => {
        state.dayCompletionStatus = 'loading';
        state.completionError = null;
      })
      .addCase(completeDay.fulfilled, (state, action) => {
        state.dayCompletionStatus = 'succeeded';
        state.progress = action.payload.progress;
        state.completionError = null;

        // 🔥 NEW: Store streak information for UI feedback
        if (action.payload.streak) {
          state.lastStreakUpdate = {
            current: action.payload.streak.current,
            longest: action.payload.streak.longest,
            isNewRecord: action.payload.streak.isNewRecord,
            challengeCompleted: action.payload.challengeCompleted,
            timestamp: Date.now()
          };
        }
      })
      .addCase(completeDay.rejected, (state, action) => {
        state.dayCompletionStatus = 'failed';
        state.completionError = action.payload;
      }),
});

// Export actions
export const {
  clearChallengeDetail,
  resetError,
  resetDayCompletionStatus
} = slice.actions;

export default slice.reducer;