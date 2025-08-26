import Client from '../../../api/index';

export const fetchHelpCenterServices = async (params?: any) => {
  try {
    const response = await Client.student.help.get(params);
    return response?.data;
  } catch (error) {
    console.log('Error fetching help center services:', error);
    throw error;
  }
};
