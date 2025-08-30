import { getattendancedata, getattendancedatabyDate } from "../serivces/attendindexs";
import { getAttendanceByDate, getattendancedetails } from "../reducers/attenSlice";

export const getStudentattendance =
    (params: any) => async (dispatch: any) => {
        try {
            const response = await getattendancedata(params);
            dispatch(getattendancedetails(response));
        } catch (error) {
            console.log(error);
        }
    };


export const getattendanceByDate =
    (params: any) => async (dispatch: any) => {
        try {
            const response = await getattendancedatabyDate(params);
            dispatch(getAttendanceByDate(response));
        } catch (error) {
            console.log(error);
        }
    }; 