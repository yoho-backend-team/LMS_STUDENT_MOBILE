import { getcoursedata } from "../Services";
import { getcoursedetails } from "./courseSlice";



export const getStudentcourse = (params: any = {}) => async (dispatch: any) => {
  try {
    const response = await getcoursedata(params);
    console.log('Course response:', response);
    dispatch(getcoursedetails(response));
    return response;
  } catch (error) {
    console.error('Error in getStudentcourse:', error);
    throw error;
  }
};