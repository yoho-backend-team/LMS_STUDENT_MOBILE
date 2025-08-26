// import { fetchFaqServices } from '../services/index';
// import { fetchFaqData } from './faqslice';

// export const fetchFaqThunk = (data: any) => async (dispatch: any) => {
//   try {
//     const response = await fetchFaqServices(data);
//     dispatch(fetchFaqData(response?.data));
//   } catch (error) {
//     console.log('Error in fetchFaqThunk:', error);
//   }
// };


import { fetchFaqServices } from "../services";
import { fetchFaqStart, fetchFaqData, fetchFaqError } from "./faqSlice";

export const fetchFaqThunk = (params?: any) => async (dispatch: any) => {
  try {
    dispatch(fetchFaqStart());
    const items = await fetchFaqServices(params);
    console.log("🟢 Data returned from service:", items);
    dispatch(fetchFaqData(items));
  } catch (error: any) {
    console.log("Error in fetchFaqThunk:", error);
    dispatch(fetchFaqError(error?.message ?? "Failed to load FAQ"));
  }
};
