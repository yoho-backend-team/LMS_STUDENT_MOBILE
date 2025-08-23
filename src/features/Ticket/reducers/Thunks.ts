import { CreateTicket, GetAllTicket } from "../Services";
import {  CreatTicketmodule, getTicket } from "./ModuleSlice";


export const GetallTicketThunks = (params: any) => async (dispatch: any) => {
  try {
    const result = await GetAllTicket(params);
    dispatch(getTicket(result?.data));   
    return result;
  } catch (error) {
    console.error('Error in TicketThunks', error);
  }
};

export const CreateTicketThunks = (data: any, params: any) => async (dispatch: any) => {
  try {
    const result = await CreateTicket(data, params);
    dispatch(CreatTicketmodule(result));  
    return result;
  } catch (error) {
    console.error('Error in CreateTicketThunks', error);
  }
};
