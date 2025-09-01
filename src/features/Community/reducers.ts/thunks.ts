import { GetAllCommunity, GetAllMessage } from "../services";
import { getCommunity, getMessage } from "./ModuleSlice";

export const GetallCommunityThunks = (params: any) => async (dispatch: any) => {
  try {
    const result = await GetAllCommunity(params);
    dispatch(getCommunity(result));
    return result.data;
  } catch (error) {
    console.error('Error in communityThunks get', error);
  }
};

export const GetallMessageThunks = (params: any) => async (dispatch: any) => {
  try {
    const result = await GetAllMessage(params);
    dispatch(getMessage(result));
    return result.data;
  } catch (error) {
    console.error('Error in communityThunks message', error);
  }
};