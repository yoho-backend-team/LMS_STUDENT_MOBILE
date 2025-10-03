import { createSlice } from "@reduxjs/toolkit";

const FaqSlice = createSlice({
    name:'FaqSlice',
    initialState:{
        data:[],
    },
    reducers:{
        getfaq: (state,action)=> {
            state.data=action.payload;
        }
    }
})

export const {getfaq}=FaqSlice.actions;

export default FaqSlice.reducer;