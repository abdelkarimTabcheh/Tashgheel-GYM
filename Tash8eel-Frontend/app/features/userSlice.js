import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL_JO } from '../../config';

// Existing fetchUserProfile thunk
export const fetchUserProfile = createAsyncThunk(
    'user/fetchUserProfile',
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL_JO}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data.message || 'Failed to fetch user profile.');
            } else if (error.request) {
                return rejectWithValue('No response received from server.');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

// NEW: Update user streak thunk
export const updateUserStreak = createAsyncThunk(
    'user/updateUserStreak',
    async ({ token, challengeCompleted = false }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL_JO}/users/streak`,
                { challengeCompleted },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data.message || 'Failed to update streak.');
            } else if (error.request) {
                return rejectWithValue('No response received from server.');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
        streakStatus: 'idle', // For streak update status
        streakError: null,
    },
    reducers: {
        setProfile: (state, action) => {
            state.profile = { ...state.profile, ...action.payload };
            state.status = 'succeeded';
        },
        // NEW: Local streak update for immediate UI feedback
        incrementStreak: (state) => {
            if (state.profile) {
                state.profile.currentStreak = (state.profile.currentStreak || 0) + 1;
                state.profile.longestStreak = Math.max(
                    state.profile.longestStreak || 0,
                    state.profile.currentStreak
                );
            }
        },
        resetStreakError: (state) => {
            state.streakError = null;
            state.streakStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            // Existing fetchUserProfile cases
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.profile = null;
            })
            // NEW: updateUserStreak cases
            .addCase(updateUserStreak.pending, (state) => {
                state.streakStatus = 'loading';
            })
            .addCase(updateUserStreak.fulfilled, (state, action) => {
                state.streakStatus = 'succeeded';
                // Update profile with new streak data
                if (state.profile) {
                    state.profile = { ...state.profile, ...action.payload.user };
                }
            })
            .addCase(updateUserStreak.rejected, (state, action) => {
                state.streakStatus = 'failed';
                state.streakError = action.payload;
            });
    },
});

export const { setProfile, incrementStreak, resetStreakError } = userSlice.actions;
export default userSlice.reducer;