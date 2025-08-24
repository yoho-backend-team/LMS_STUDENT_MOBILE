import { createSlice } from '@reduxjs/toolkit';

const NotificationSlice = createSlice({
    name: 'NotificationSlice',
    initialState: {
        data: [],
    },
    reducers: {
        getNotifications: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { getNotifications } = NotificationSlice.actions;
export default NotificationSlice.reducer;
