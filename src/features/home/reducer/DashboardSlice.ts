import { createSlice } from '@reduxjs/toolkit';

const DashboardSlice = createSlice({
    name: 'DashboardSlice',
    initialState: {
        data: [],
       
    },
    reducers: {
        getDashboardData: (state, action) => {
            state.data = action.payload;
        },

    },
});

export const { getDashboardData } = DashboardSlice.actions;
export default DashboardSlice.reducer;
