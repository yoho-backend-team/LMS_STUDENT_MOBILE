import { createSlice } from '@reduxjs/toolkit';

const ModuleSlice = createSlice({
	name: 'Community',
	initialState: {
		community: [],
        communityIdData: []
		
	},
	reducers: {
		getCommunity: (state, action) => {
			state.community = action.payload;
		},
        getMessage: (state, action) => {
			state.communityIdData = action.payload;
		},

        
	
	},
});
export const {
	getCommunity,getMessage
} = ModuleSlice.actions;
export default ModuleSlice.reducer;
