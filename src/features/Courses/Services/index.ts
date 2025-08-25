import Client from "../../../api/index"

export const getcoursedata = async (params: any) => {
  try {
    const response = await Client.student.course.get(params);
    return response?.data; 
  } catch (error) {
    console.error('Error in getcoursedata:', error);
    throw error;
  }
}