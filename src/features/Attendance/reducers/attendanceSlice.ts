import { createSlice } from '@reduxjs/toolkit';

const   AttendanceSlice = createSlice({
	name: 'AttendanceSlice',
	initialState: {
		data: {},
		dataByDate:[]
        
	},
	reducers: {
		getattendancedetails: (state, action) => {
			state.data = action.payload;
		},
		getAttendanceByDate:(state, action) => {
			state.dataByDate = action.payload;

		},
	},
});

export const { getattendancedetails,getAttendanceByDate } = AttendanceSlice.actions;
export default AttendanceSlice.reducer;
