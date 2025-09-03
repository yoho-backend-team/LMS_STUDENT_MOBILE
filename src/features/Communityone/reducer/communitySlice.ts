import { createSlice } from '@reduxjs/toolkit';

const CommunitySlice = createSlice({
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
} 
= CommunitySlice.actions;
export default CommunitySlice.reducer;
