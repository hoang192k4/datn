import {configureStore} from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import notiSlice from './slices/notiSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        noti: notiSlice,
    }
})