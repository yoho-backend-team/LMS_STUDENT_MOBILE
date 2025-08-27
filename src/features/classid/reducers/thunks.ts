import { getClassDetailsId } from '../services';
import { getClassIdDetails } from '../reducers/classidslice';

export const getClassIdDetail = (params: any) => async (dispatch: any) => {
  try {
    const response = await getClassDetailsId(params);
    if (response) {
      dispatch(getClassIdDetails(response?.data?.data));
    }
  } catch (error) {
    console.log(error);
  }
};
