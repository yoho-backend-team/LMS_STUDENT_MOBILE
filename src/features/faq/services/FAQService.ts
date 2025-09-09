import Client from "../../../api/index"; 

export const getStudentFaq = async (params: any) => {
  const response = await Client.student.faq.get(params);
  return response;
};
