import {
  setAllAttendance,
  setAttendanceByDate,
  setClassAttendance,
} from '../reducers/attenSlice';
import {
  getAllAttendanceClient,
  getAttendanceByDateClient,
  getClassAttendanceClient,
} from '../services/index';


export const getAllAttendanceThunk = (params: any) => async (dispatch: any) => {
  try {
    const response = await getAllAttendanceClient(params);
    dispatch(setAllAttendance(response));
    return response;
  } catch (error) {
    console.log('Error in getAllAttendanceThunk:', error);
    throw error; 
  }
};


export const getAttendanceByDateThunk = (params: any) => async (dispatch: any) => {
  try {
    const response = await getAttendanceByDateClient(params);
    dispatch(setAttendanceByDate(response));
    return response;
  } catch (error) {
    console.log('Error in getAttendanceByDateThunk:', error);
  }
};


export const getClassAttendanceThunk = (data: { classId: any }) => async (dispatch: any) => {
  try {
    const response = await getClassAttendanceClient(data);
    dispatch(setClassAttendance(response));
    return response;
  } catch (error) {
    console.log('Error in getClassAttendanceThunk:', error);
  }
};
