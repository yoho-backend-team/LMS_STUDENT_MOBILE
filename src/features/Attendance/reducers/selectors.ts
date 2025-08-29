export const selectAllAttendance = (state: any) => state.AttendanceSlice?.all || {};
export const selectAttendanceByDate = (state: any) => state.AttendanceSlice.byDate;
export const selectClassAttendance = (state: any) => state.AttendanceSlice.classData;
