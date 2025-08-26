import { GetAllClasses } from '../services';
import { getClasses } from '../reducers/classesslice';

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
