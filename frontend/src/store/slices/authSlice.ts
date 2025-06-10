import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthentication: false,
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.isAuthentication = true;
            state.user = action.payload.user;
        },
        logout(state) {
            state.isAuthentication = false;
            state.user = null;
        }
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;