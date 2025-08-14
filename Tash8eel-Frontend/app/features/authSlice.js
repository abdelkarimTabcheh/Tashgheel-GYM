import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        isSignedIn: false,
        status: 'idle', // 'idle' | 'checking' | 'signedIn' | 'signedOut'
        error: null,
    },
    reducers: {
        setAuthToken: (state, action) => {
            state.token = action.payload;
        },
        setSignedIn: (state, action) => {
            state.isSignedIn = action.payload;
        },
        setAuthStatus: (state, action) => {
            state.status = action.payload;
        },
        // This is the main reducer to call after successful login
        signIn: (state, action) => {
            state.token = action.payload.token;
            state.isSignedIn = true;
            state.status = 'signedIn';
        },
        signOut: (state) => {
            state.token = null;
            state.isSignedIn = false;
            state.status = 'signedOut';
        },
    },
});

export const { setAuthToken, setSignedIn, setAuthStatus, signIn, signOut } = authSlice.actions;
export default authSlice.reducer;