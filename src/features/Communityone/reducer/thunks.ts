import { getAllCommunity, getAllMessage } from "../services";
import { getCommunity, getMessage } from "./communitySlice";

export const getallCommunityThunks = (params: any) => async (dispatch: any) => {
  try {
    const result = await getAllCommunity(params);
    dispatch(getCommunity(result));
    return result.data;
  } catch (error) {
    console.error('Error in communityThunks', error);
  }
};

export const getallMessageThunks = (params: any) => async (dispatch: any) => {
  try {
    const result = await getAllMessage(params);
    dispatch(getMessage(result));
    return result.data;
  } catch (error) {
    console.error('Error in communityThunks', error);
  }
};