import { fetchHelpCenterServices } from '../Services/Index';
import { fetchHelpCenterData } from './HelpSlice';

export const fetchHelpCenterThunk = (data: any) => async (dispatch: any) => {
  try {
    const response = await fetchHelpCenterServices(data);
    console.log('response in thunk', response);
    dispatch(fetchHelpCenterData(response?.data));
  } catch (error) {
    console.log('Error in fetchHelpCenterThunk:', error);
  }
};
