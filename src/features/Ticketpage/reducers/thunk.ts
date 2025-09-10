import { createticketdata, GetAllTicket } from '../services/index';
import { CreatTicketmodule, getTicket } from './TicketSlice';

export const getallTicketThunks = (params: any) => async (dispatch: any) => {
  try {
    const result = await GetAllTicket(params);
    dispatch(getTicket(result?.data));
    return result;
  } catch (error) {
    console.error('Error in TicketThunks', error);
  }
};

export const createTicketThunks = (data: any, params: any) => async (dispatch: any) => {
  try {
    const result = await createticketdata(data, params);
    dispatch(CreatTicketmodule(result));
    return result;
  } catch (error) {
    console.error('Error in CreateTicketThunks', error);
  }
};
