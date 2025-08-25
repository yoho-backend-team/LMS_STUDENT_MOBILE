import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';

const backendUrl = 'https://lms-node-backend-v1.onrender.com/api';
// const backendUrl = 'https://10.29.248.157:3001/api';

const Axios = axios.create({
  baseURL: backendUrl,
  timeout: 5000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('AuthStudentToken');

  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
});

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('HTTP Error:', error.response);
    if (
      error?.response &&
      error?.response.status == 401 &&
      error?.response?.data?.status === 'session_expired'
    ) {
      Alert.alert('Session expired', 'Please login');
      await AsyncStorage.removeItem('AuthStudentToken');
      await AsyncStorage.removeItem('StudentData');
    }
  }
);

class HttpClient {
  async get(url: string, params?: any, userType?: string | undefined) {
    const response = await Axios.get(url, {
      params: params,
      headers: {
        'User-Type': userType,
      },
    });
    return response;
  }

  async post(url: string, data?: any, params?: any, userType?: string) {
    const response = await Axios.post(url, data, {
      params: params,
      headers: {
        'User-Type': userType,
      },
    });
    return response;
  }

  async update(url: string, data?: any, userType?: string) {
    try {
      const response = await Axios.put(url, data, {
        headers: {
          'User-Type': userType,
        },
      });
      return response;
    } catch (error) {
      console.error('API update error:', error);
      throw error;
    }
  }

  async delete(url: string, data?: { uuid: string }, userType?: string) {
    const response = await Axios.delete(url, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'User-Type': userType,
      },
      params: data,
    });
    return response;
  }

  async fileGet(url: string, userType?: undefined) {
    const response = Axios.get(url, {
      responseType: 'blob',
      headers: {
        'User-Type': userType,
      },
    });
    return response;
  }

  async uploadFile(url: string, data?: any, userType?: string) {
    const response = await Axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'User-Type': userType,
      },
    });

    return response;
  }
}

export default new HttpClient();
