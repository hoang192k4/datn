// src/store/slices/notificationSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
    unreadCount: number;
}

const initialState: NotificationState = {
    unreadCount: 0,
};

const notiSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setUnreadCount(state, action: PayloadAction<number>) {
            state.unreadCount = action.payload;
        },
        decrementUnread(state) {
            if (state.unreadCount > 0) state.unreadCount -= 1;
        },
        incrementUnread(state) {
            state.unreadCount += 1;
        },
        resetUnread(state) {
            state.unreadCount = 0;
        },
    },
});

export const {
    setUnreadCount,
    decrementUnread,
    incrementUnread,
    resetUnread,
} = notiSlice.actions;

export default notiSlice.reducer;
