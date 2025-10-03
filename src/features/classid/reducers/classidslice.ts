import { createSlice } from "@reduxjs/toolkit";


const ClassIdSlice = createSlice({
    name: 'ClassIdSlice',
    initialState: {
        data: [],
    },
    reducers: {
        getClassIdDetails : (state,action) => {
            state.data = action.payload;
        },
    },
})

export const { getClassIdDetails } = ClassIdSlice.actions;
export default ClassIdSlice.reducer;