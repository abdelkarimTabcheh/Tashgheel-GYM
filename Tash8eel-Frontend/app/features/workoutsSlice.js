// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { fetchWorkoutsFromAPI } from './workoutsAPI';

// export const fetchWorkouts = createAsyncThunk(
//   'workouts/fetchWorkouts',
//   async () => {
//     const data = await fetchWorkoutsFromAPI();
//     return data;
//   }
// );

// const workoutsSlice = createSlice({
//   name: 'workouts',
//   initialState: {
//     data: [],
//     status: 'idle',
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchWorkouts.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchWorkouts.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.data = action.payload;
//       })
//       .addCase(fetchWorkouts.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       });
//   },
// });

// export default workoutsSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { API_BASE_URL_JO } from '../../config';

// // Async thunk to fetch workouts
// export const fetchWorkouts = createAsyncThunk(
//   'workouts/fetchWorkouts',
//   async () => {
//     const response = await fetch(`${API_BASE_URL_JO}/api/workouts`);
//     if (!response.ok) throw new Error('Failed to fetch workouts');
//     return await response.json();
//   }
// );

// const workoutsSlice = createSlice({
//   name: 'workouts',
//   initialState: {
//     data: [],
//     status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
//     error: null,
//   },
//   reducers: {
//     // you can add synchronous reducers here if needed
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchWorkouts.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchWorkouts.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.data = action.payload;
//       })
//       .addCase(fetchWorkouts.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       });
//   },
// });

// export default workoutsSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL_JO } from '../../config';

// Async thunk to fetch workouts
export const fetchWorkouts = createAsyncThunk(
  'workouts/fetchWorkouts',
  async () => {
    const response = await fetch(`${API_BASE_URL_JO}/api/workouts`);
    if (!response.ok) throw new Error('Failed to fetch workouts');
    return await response.json();
  }
);

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState: {
    data: [],           // Note: workouts are in 'data'
    status: 'idle',     // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkouts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default workoutsSlice.reducer;
