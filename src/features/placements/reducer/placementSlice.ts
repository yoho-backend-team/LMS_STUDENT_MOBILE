import { createSlice } from '@reduxjs/toolkit';

const PlacementSlice = createSlice({
  name: 'PlacementSlice',
  initialState: {
    data: [],
  },
  reducers: {
    getPlacementData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { getPlacementData } = PlacementSlice.actions;
export default PlacementSlice.reducer;
