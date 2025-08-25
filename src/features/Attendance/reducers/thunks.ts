import { getattendancedata } from "../service";
import { getattendancedetails } from "../reducers/AttendanceSlice";



export const getStudentcourse = (params: any = {}) => async (dispatch: any) => {
  try {
    const response = await getattendancedata(params);
    dispatch(getattendancedetails(response));
    return response;
  } catch (error) {
    console.error('Error in getStudentcourse:', error);
    throw error;
  }
};