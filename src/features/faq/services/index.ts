// import Client from '../../../api/index';

// export const GetAllfaq = async (params: any) => {
//   try {
//     const response = await Client.student.faq.get(params);
//     console.log('API raw response:', response);
//     return response?.data ?? [];
//   } catch (error) {
//     console.error('Error in GetAllfaq service:', error);
//     return [];
//   }
// };
import axios from "axios";

const instance = axios.create({
  baseURL: "https://lms-node-backend-v1.onrender.com/api",
 
  timeout: 20000,
});

export const services = {
  faq: {
    get: async (params?: Record<string, any>) => {
      const res = await instance.get("institutes/faq/all", { params });
      return (res.data as any)?.data ?? res.data;
    },
  },
};