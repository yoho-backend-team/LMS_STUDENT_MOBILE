





import { createAsyncThunk } from '@reduxjs/toolkit';
import { getcoursedata } from "../Services";

export type GetCourseByIdParams = {
  instituteId: string;
  branchId: string;
  courseId: string;
};

export const getCourseById = createAsyncThunk(
  'courses/getCourseById',
  async ({ instituteId, branchId, courseId }: GetCourseByIdParams, { rejectWithValue }) => {
    try {
      const data = await getcoursedata({ instituteId, branchId, courseId });
      return data;
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Request failed';
      return rejectWithValue(msg);
    }
  }
);