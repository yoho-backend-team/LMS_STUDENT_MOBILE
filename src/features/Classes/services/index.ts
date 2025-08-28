import Client from '../../../api/index';
export const GetAllClasses = async (params: { courseId: string; classType: 'upcoming' | 'completed' }) => {
  try {
    const response = await Client.student.class.get({
      courseId: params.courseId,
      query: {
        userType: 'online',  
        classType: params.classType,
        page: 1,
        month: '',
        year: '',
        course: '',
      },
    });
    console.log(`API ${params.classType} response:`, response);
    return response?.data ?? [];
  } catch (error) {
    console.error(`Error in GetAllClasses (${params.classType}):`, error);
    return [];
  }
};


