import Client from '../../../../api/index';

export const getActivityData = async (params: any) => {
  const response = await Client.student.activity.get(params);
  if (response) {
    return response;
  }
};
