import { getLiveClassDetails } from '../services';
import { getclassdetails } from './classslice';

interface ClassPayload {
  userType: string;
  classType: 'live' | 'upcoming' | 'completed';
  page: number;
  month?: string;
  year?: string;
  courseId?: string;
}

export const getClassDetails = (params: ClassPayload) => async (dispatch: any) => {
  try {
    const response = await getLiveClassDetails(params);
    dispatch(getclassdetails(response));
  } catch (error) {
    console.error('Error fetching class details:', error);
  }
};
