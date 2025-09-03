import Client from '../../../api/index';

export const getAllCommunity = async (params: any) => {
  const response = await Client.student.community.get(params);
  return response?.data.data;
};

export const getAllMessage = async (params: any) => {
  const response = await Client.student.community.get_messages(params);
  return response?.data.data;
};
