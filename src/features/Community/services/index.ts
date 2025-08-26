import Client from '../../../api/index';

export const GetAllCommunity = async (params: any) => {
  const response = await Client.student.community.get(params);
  console.log(response.data,"community services")
  return response?.data.data;
};

export const GetAllMessage = async (params: any) => {
  const response = await Client.student.community.get_messages(params);
  console.log(response.data,"community message services")
  return response?.data.data;
};
