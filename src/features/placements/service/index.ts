import Client from '../../../api/index';

export const getPlacement = async (params: any) => {
  const response = await Client.student.placement.get(params);
  if (response) {
    return response;
  }
};
