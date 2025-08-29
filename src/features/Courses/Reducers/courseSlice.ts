


import { createSlice } from '@reduxjs/toolkit';
import { getCourseById } from './thunks';

const CourseSlice = createSlice({
  name: 'CourseSlice',
  initialState: { data: null as any, loading: false, error: null as string | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourseById.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(getCourseById.fulfilled, (state, action) => {
        state.loading = false;
        
        state.data = action.payload?.data ?? action.payload ?? null;
      })
      .addCase(getCourseById.rejected, (state, action) => {
        state.loading = false; state.error = String(action.payload ?? 'Failed to fetch course');
      });
  },
});

export default CourseSlice.reducer;