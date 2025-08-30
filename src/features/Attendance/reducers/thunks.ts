import { getattendancedata, getattendancedatabyDate } from "../services/servicesindex";
import { getAttendanceByDate, getattendancedetails } from "./attendanceSlice";

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