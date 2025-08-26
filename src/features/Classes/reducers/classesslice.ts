import { createSlice } from '@reduxjs/toolkit';

const ClassesSlice = createSlice({
  name: 'Classes',
  initialState: {
    data: [], 
  },
  reducers: {
    getClasses: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { getClasses } = ClassesSlice.actions;
export default ClassesSlice.reducer;
