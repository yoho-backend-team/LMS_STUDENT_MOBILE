
import { createSlice } from '@reduxjs/toolkit'

const ActivitySlice = createSlice({
    name : "ActivitySlice",
    initialState : {
        data : []
    },
    reducers : {
        getActivity : (state,action) =>  {
            state.data = action.payload
        }
    }
})

export default ActivitySlice.reducer
export const {getActivity} = ActivitySlice.actions;