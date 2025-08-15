import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchChallenges, createChallenge, updateChallenge, deleteChallenge } from '../services/challengeService';

export const getChallenges = createAsyncThunk('challenges/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await fetchChallenges();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch challenges');
  }
});

export const addChallenge = createAsyncThunk('challenges/add', async (data, thunkAPI) => {
  try {
    const res = await createChallenge(data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to add challenge');
  }
});

export const editChallenge = createAsyncThunk('challenges/edit', async ({ id, challenge }, thunkAPI) => {
  try {
    const res = await updateChallenge(id, challenge);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update challenge');
  }
});

export const removeChallenge = createAsyncThunk('challenges/delete', async (id, thunkAPI) => {
  try {
    await deleteChallenge(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete challenge');
  }
});

const challengeSlice = createSlice({
  name: 'challenges',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getChallenges.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getChallenges.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(getChallenges.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addChallenge.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editChallenge.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(removeChallenge.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c._id !== action.payload);
      });
  },
});

export default challengeSlice.reducer;
