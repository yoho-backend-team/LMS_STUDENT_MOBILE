// import Client from "../../../api/index"

// export const getcoursedata = async (params: any) => {
//   try {
//     const response = await Client.student.course.get(params);
//     return response?.data; 
//   } catch (error) {
//    console.log(" [Service] Calling API with params:",);
//     console.error('Error in getcoursedata:', error);
//     throw error;
//   }
// }

import Client from "../../../api/index";

export const getcoursedata = async (params: { instituteId: string; branchId: string; courseId: string }) => {
  console.log(" [Service] Calling API with params:", params);
  if (!params?.instituteId || !params?.branchId || !params?.courseId) {
    throw new Error("Missing required IDs");
  }
  const resp = await Client.student.course.get(params);
  console.log("[Service] Response:", resp?.data);
  return resp?.data; 
};



