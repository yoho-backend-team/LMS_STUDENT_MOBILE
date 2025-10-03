import Client from '../../../api/index';

export const GetAllCommunity = async (params: any) => {
  const response = await Client.student.community.get(params);
  return response?.data.data;
};

export const GetAllMessage = async (params: any) => {
  const response = await Client.student.community.get_messages(params);
  return response?.data.data;
};
