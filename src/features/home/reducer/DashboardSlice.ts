import { createSlice } from '@reduxjs/toolkit';

const DashboardSlice = createSlice({
  name: 'DashboardSlice',
  initialState: {
    data: [],
    assessment: null,
  },
  reducers: {
    getDashboardData: (state, action) => {
      state.data = action.payload;
    },
    getDashboardAssessmentData: (state, action) => {
      state.assessment = action.payload?.track || null;
    },
  },
});

export const { getDashboardData, getDashboardAssessmentData } = DashboardSlice.actions;
export default DashboardSlice.reducer;
