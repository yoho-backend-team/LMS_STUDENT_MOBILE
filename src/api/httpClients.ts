import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const backendUrl = 'https://lms-node-backend-v1.onrender.com/api';

const Axios = axios.create({
  baseURL: backendUrl,
  timeout: 5000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('AuthStudentToken');

  if (true) {
    // config.headers['Authorization'] = `Token ${token}`;
    config.headers['Authorization'] =
      `Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11c2tAZ21haWwuY29tIiwicm9sZSI6IjY3YTA2ODg1NDAwZmZhZTJkMjA2YWJmZCIsImluc3RpdHV0ZV9pZCI6eyJjb250YWN0X2luZm8iOnsiYWRkcmVzcyI6eyJhZGRyZXNzMSI6Ik5vIDMsIFNhbG1hbiBDb21wbGV4IiwiYWRkcmVzczIiOiIgUHVkdWtvdHRhaSBNYWluIFJkIiwic3RhdGUiOiJUYW1pbCBOYWR1IiwiY2l0eSI6IlRpcnVjaGlyYXBwYWxsaSIsInBpbmNvZGUiOiI2MjAwMjQifSwicGhvbmVfbm8iOiI5MTQzOTI0MDc5NDYiLCJhbHRlcm5hdGVfbm8iOiI5MTQzOTI0MDc5NDYifSwic29jaWFsX21lZGlhIjp7InR3aXR0ZXJfaWQiOiJ3d3cudHdpdHRlci5jb20iLCJmYWNlYm9va19pZCI6Ind3dy5mYmsuY29tIiwiaW5zdGFncmFtX2lkIjoid3d3Lmluc3RhZ3JhbS5jb21tIiwibGlua2VkaW5faWQiOiJ3d3cubGlua2Vkbi5jb20ifSwiZG9jcyI6eyJnc3QiOnsibnVtYmVyIjoiIiwiZmlsZSI6IiJ9LCJwYW4iOnsibnVtYmVyIjoiIiwiZmlsZSI6IiJ9fSwiX2lkIjoiNjdmM2EyNmRmNGIyYzUzMGFjZDE2NDE5IiwiaW5zdGl0dXRlX25hbWUiOiJBbm5hIFVuaXZlcnNpdHkgUk8gVGlydWNoaXJhcHBhbGxpIiwiZW1haWwiOiJpbmZvQGF1Yml0LmVkdS5pbiIsInN1YnNjcmlwdGlvbiI6IjY3ZjM2ZGFiOWZkMmM0MTNiMDk2MjcxZSIsInJlZ2lzdGVyZWRfZGF0ZSI6IjQvNy8yMDI1IiwiYnJhbmNoZXMiOltdLCJ3ZWJzaXRlIjoiaHR0cHM6Ly93d3cuYXViaXQuaW4iLCJkZXNjcmlwdGlvbiI6IlVuaXZlcnNpdHkgQ29sbGVnZSBvZiBFbmdpbmVlcmluZyAoQklUIENhbXB1cyksIEFubmEgVW5pdmVyc2l0eSBUaXJ1Y2hpcmFwcGFsbGkgb3RoZXJ3aXNlIEFubmEgVW5pdmVyc2l0eSBDaGVubmFpIOKAkyBSZWdpb25hbCBPZmZpY2UsIFRpcnVjaGlyYXBwYWxsaSAoQVVDLVJPVCksIGVyc3R3aGlsZSBBbm5hIFVuaXZlcnNpdHkgb2YgVGVjaG5vbG9neSwgVGlydWNoaXJhcHBhbGxpLCBpcyBhIHRlY2huaWNhbCB1bml2ZXJzaXR5IGRlcGFydG1lbnQgb2YgQW5uYSBVbml2ZXJzaXR5LCBJdCBpcyBsb2NhdGVkIG9uIFRpcnVjaGlyYXBwYWxsaeKAk1B1ZHVra290dGFpIE5hdGlvbmFsIEhpZ2h3YXkgMzM2LCBUYW1pbCBOYWR1LCBJbmRpYS4gSXQgd2FzIGVzdGFibGlzaGVkIG9uIDE5OTkgYXMgYSBwYXJ0IG9mIEJoYXJhdGhpZGFzYW4gVW5pdmVyc2l0eSB3aXRoIGZpdmUgZGVwYXJ0bWVudHMgdml6enoiLCJsb2dvIjoic3RhdGljZmlsZXMvbG1zL2E5NjM3ZjNiLWVjMjEtNDJlYS04MGY1LTU3OGUxZTc1MWI1Yy5wbmciLCJpbWFnZSI6InN0YXRpY2ZpbGVzL2xtcy9iNzQ3N2Y0My1hOGI0LTQzMmYtOGIxNS1iNGMyYzk5ZWFkN2IuanBnIiwiZ2FsbGVyeV9pbWFnZXMiOlsic3RhdGljZmlsZXMvbG1zL2YzYzc5NzU3LWFmODQtNGExYi1hYzE2LTk3MWNjZjUzMjcxMS5qcGVnIiwic3RhdGljZmlsZXMvbG1zLzVhYjhmNjUzLTM1MDQtNDIwYi05NWE1LTYxOGJmYTE1NzE1My5qcGciLCJzdGF0aWNmaWxlcy9sbXMvZmEyYjZjM2MtMjk0YS00NjNhLTk5NTMtNjE1ZmMxOWU4ZmUzLmpwZyJdLCJpc19zdWJzY3JpcHRpb25fZXhwaXJlZCI6ZmFsc2UsImluc3RpdHV0ZV9hY3RpdmVfc3RhdHVzIjoiQWN0aXZlIiwiSW5zdGl0dXRlX1N0YXR1cyI6ImFjdGl2ZSIsImlzX2FjdGl2ZSI6dHJ1ZSwiaXNfZGVsZXRlZCI6ZmFsc2UsIndlbG9jbWVfbWFpbF9zZW50IjpmYWxzZSwid2Vsb2NtZV9tYWlsX3NlbnRfYXQiOm51bGwsInNsdWciOiJhbm5hLXVuaXZlcnNpdHktcm8tdGlydWNoaXJhcHBhbGxpIiwiY3JlYXRlZEF0IjoiMjAyNS0wNC0wN1QxMDowMToxOC4wMDZaIiwidXBkYXRlZEF0IjoiMjAyNS0wNS0xOFQwMTo1NzoxNC42OTNaIiwidXVpZCI6Ijk3MzE5NWMwLTY2ZWQtNDdjMi1iMDk4LWQ4OTg5ZDNlNDUyOSIsImlkIjoxMDYsIl9fdiI6MH0sInV1aWQiOiI2MGQ1OTI0Mi1mOTIyLTRjMzQtODk3NC1lYTIwN2FjYWRlZWMiLCJ1c2VyX3R5cGUiOiJpbnN0aXR1dGUiLCJpYXQiOjE3NTU5NDEyMTcsImV4cCI6MTc1NjAyNzYxN30.mMbaWDV-Clxa3xqj_L7D43OUcJb24bMDpqMKJLjh8Mg`;
  }
  return config;
});

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("HTTP Error:", error.response)
    if (
      error?.response &&
      error?.response.status == 401 &&
      error?.response?.data?.status === 'session_expired'
    ) {
      await AsyncStorage.removeItem('AuthStudentToken');
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

  async uploadFile(url: string, data?: any, userType?: undefined) {
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
