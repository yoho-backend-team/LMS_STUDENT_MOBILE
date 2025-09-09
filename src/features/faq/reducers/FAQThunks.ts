import { getStudentFaq } from "../services/FAQService";
import { getfaq } from "./FAQSlice";

export const getFaqThunk = (params: any) => async (dispatch: any) => {
  try {
    const response = await getStudentFaq(params);
    dispatch(getfaq(response?.data || []));
  } catch (error) {
    console.error("Error fetching FAQs:", error);
  }
};
