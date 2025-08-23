import Client from "../../../api/index"



export const GetAllTicket = async (params: any) => {
  const response = await Client.student.ticket.get(params);
  console.log(response, "Ticket in Services");
  return response?.data || [];   
};

export const CreateTicket = async (data: any, params: any) => {
  try {
    const response = await Client.student.ticket.create(data, params);
    console.log(response, "Ticket Created in Services");
    return response?.data || null;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
};
