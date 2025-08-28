import { GetAllClasses } from '../services';
import { getClasses } from '../reducers/classesslice';
import Client from '../../../api/index';
// thunk.ts
export const GetallClassesThunks = (params: any) => async (dispatch: any) => {
  try {
    const result = await GetAllClasses(params);
    dispatch(getClasses(result.data || []));
    return result;
  } catch (error) {
    console.error('Error in ClassesThunks', error);
  }
};
export const GetClassesByCourseIdThunks = (params: { courseId: string; classType: 'upcoming' | 'completed' | 'live' }) => async (dispatch: any) => {
  try {
    const result = await Client.student.class.getWithId({
      id: params.courseId,
      query: {
        userType: 'online',
        classType: params.classType,
        page: 1,
        month: '',
        year: '',
        course: '',
      },
    });

    dispatch(getClasses(result.data || []));
    return result;
  } catch (error) {
    console.error('Error in GetClassesByCourseIdThunks', error);
  }
};