import Client from '../../../api/index';

export const getLiveClassDetails = async (params: any) => {
  const response = await Client.student.class.get(params);
  if (response) return response?.data;
};
