import { createSlice } from '@reduxjs/toolkit';

const   CourseSlice = createSlice({
	name: 'CourseSlice',
	initialState: {
		data: [],
        
	},
	reducers: {
		getcoursedetails: (state, action) => {
			state.data = action.payload;

		},
		
		
	},
});

export const { getcoursedetails } = CourseSlice.actions;
export default CourseSlice.reducer;