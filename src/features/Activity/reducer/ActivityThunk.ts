import { getActivityData } from '../services';
import { getActivity } from './ActivitySlice';

export const getAllActivityData = (params: any) => async (dispatch: any) => {
  try {
    const response = await getActivityData(params);
    dispatch(getActivity(response?.data));
  } catch (error) {
    console.log(error);
  }
};
