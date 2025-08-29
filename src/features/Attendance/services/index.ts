import Client from '../../../api/index';

export const getAllAttendanceClient = async (params: any) => { 
  try {
    console.log("API Call Params:", params);
    const response = await Client.student.attendance.get(params);
    console.log("API Response:", response);
    return response?.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
export const getAttendanceByDateClient = async (params: any) => {
  const response = await Client.student.attendance.getByDate(params);
  return response?.data;
};

export const getClassAttendanceClient = async (data: { classId: any }) => {

  const { classId, ...rest } = data;

  const response = await Client.student.attendance.get_class_attendance({
    classId,
    ...rest, 
  });

  return response?.data;
};