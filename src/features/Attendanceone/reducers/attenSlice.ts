import { createSlice } from '@reduxjs/toolkit';

const   AttendanceoneSlice = createSlice({
	name: 'AttendanceoneSlice',
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

export const { getattendancedetails,getAttendanceByDate } = AttendanceoneSlice.actions;
export default AttendanceoneSlice.reducer;
