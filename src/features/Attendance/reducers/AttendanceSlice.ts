import { createSlice } from '@reduxjs/toolkit';

const   AttendanceSlice = createSlice({
	name: 'AttendanceSlice',
	initialState: {
		data: [],
        
	},
	reducers: {
		getattendancedetails: (state, action) => {
			state.data = action.payload;

		},
		
		
	},
});

export const { getattendancedetails } = AttendanceSlice.actions;
export default AttendanceSlice.reducer;