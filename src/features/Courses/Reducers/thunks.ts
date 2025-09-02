import { getcoursedata, taskdataget } from "../Services";
import { getcoursedetails, getcousetask } from "./courseSlice";



export const getStudentcourse = (params: any = {}) => async (dispatch: any) => {
  try {
    const response = await getcoursedata(params);
    dispatch(getcoursedetails(response));
    return response;
  } catch (error) {
    console.error('Error in getStudentcourse:', error);
    throw error;
  }
};

export const getStudentTask =(params:any)=>async (dispatch:any)=>{
  try{
    const response = await taskdataget(params)
    dispatch(getcousetask(response?.data))
  }
  catch(error){
    console.log('error fetching course data task',error)
  }
}