import { createSlice } from '@reduxjs/toolkit';

const   CourseSlice = createSlice({
	name: 'CourseSlice',
	initialState: {
		data: [],
        courseTask:[],
	},
	reducers: {
		getcoursedetails: (state, action) => {
			state.data = action.payload;

		},
       getcousetask:(state,action)=>{
		state.courseTask=action.payload
	   },
		
		
	},
});

export const { getcoursedetails,getcousetask } = CourseSlice.actions;
export default CourseSlice.reducer;