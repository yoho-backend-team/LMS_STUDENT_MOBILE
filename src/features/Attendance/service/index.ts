import Client from "../../../api/index"

export const getattendancedata = async (params: any) => {
  try {
    const response = await Client.student.attendance.get(params);
    return response?.data; 
  } catch (error) {
    console.error('Error in getattendancedata:', error);
    throw error;
  }
}

export const getdateattendancedata = async (params: any) => {
  try {
    const response = await Client.student.attendance.getByDate(params);
    return response?.data; 
  } catch (error) {
    console.error('Error in getdateattendancedata:', error);
    throw error;
  }
}

export const classattendancedata = async (params: any) => {
  try {
    const response = await Client.student.attendance.get_class_attendance(params);
    return response?.data; 
  } catch (error) {
    console.error('Error in classattendancedata:', error);
    throw error;
  }
} 