import Client from '../../../api/index';

export const GetAllTicket = async (params: any) => {
  const response = await Client.student.ticket.get(params);
  return response?.data || [];
};

export const createticketdata = async (data: any, params: any) => {
  const response = await Client.student.ticket.create(data, params);
  if (response) {
    return response;
  }
};

export const uploadticketfile = async (data: any) => {
  const response = await Client.common.file.upload(data);
  if (response) {
    return response;
  }
};
