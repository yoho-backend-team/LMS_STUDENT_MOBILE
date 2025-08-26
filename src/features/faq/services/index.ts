
// import axios from "axios";

// const instance = axios.create({
//   baseURL: "https://lms-node-backend-v1.onrender.com/api",
 
//   timeout: 20000,
// });

// export const services = {
//   faq: {
//     get: async (params?: Record<string, any>) => {
//       const res = await instance.get("institutes/faq/all", { params });
//       return (res.data as any)?.data ?? res.data;
//     },
//   },
// };


// import Client from '../../../api/index';

// export const fetchFaqServices = async (params?: any) => {
//   try {
//     const response = await Client.student.faq.get(params);
//     return response?.data;
//   } catch (error) {
//     console.log('Error fetching faq services:', error);
//     throw error;
//   }
// };

// import Client from "../../../api";

// export const fetchFaqServices = async (params?: any) => {
//   try {
//     const response = await Client.student.faq.get(params);
//     console.log("🔵 API raw response:" );
//     // API sometimes returns { data: [...] } or directly [...]
//     const data = (response as any)?.data?.data ?? (response as any)?.data ?? [];
//     return data; // expect FaqItem[]
//   } catch (error) {
//     console.log("Error fetching faq services:", error);
//     throw error;
//   }
// };


// features/faq/services/index.ts
import httpClient from "../../../api/httpClients";   // ← path to your HttpClient.ts

export const fetchFaqServices = async (params?: any) => {
  try {
    const response = await httpClient.get("/institutes/faq/all", params, "student");
    console.log("🔵 API raw response:", response?.data);
    const data = (response as any)?.data?.data ?? (response as any)?.data ?? [];
    return data; // expect FaqItem[]
  } catch (error) {
    console.log("Error fetching faq services:", error);
    throw error;
  }
};

