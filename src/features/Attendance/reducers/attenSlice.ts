import { createSlice } from '@reduxjs/toolkit';

const AttendanceSlice = createSlice({
  name: 'AttendanceSlice',
  initialState: {
    all: {},       
    byDate: [],   
    classData: [], 
  },
  reducers: {
    setAllAttendance: (state, action) => {
      state.all = action.payload;
    },
    setAttendanceByDate: (state, action) => {
      state.byDate = action.payload;
    },
    setClassAttendance: (state, action) => {
      state.classData = action.payload;
    },
  },
});

export const { setAllAttendance, setAttendanceByDate, setClassAttendance } =
  AttendanceSlice.actions;
export default AttendanceSlice.reducer;
