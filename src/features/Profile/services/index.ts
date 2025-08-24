import Client from '../../../api/index';

export const getStudentProfile = async (params:any) => {
    const response = await Client.student.profile.get(params);
    if (response) {
        return response;
    }
};

export const updateStudentProfile = async (data: any) => {
  try {
    const response = await Client.student.profile.update(data);
    return response;
  } catch (error) {
    console.error('API error:', error); 
    throw error;
  }
};

