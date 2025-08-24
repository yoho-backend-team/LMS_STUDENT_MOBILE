import { getStudentLoginClient, getStudentLogoutClient } from '../services';

export const getStudentLogin = (data: any, params: any) => async (dispatch: any) => {
  try {
    const response = await getStudentLoginClient(data, params);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getStudentLogout = (params: any) => async () => {
  try {
    const response = await getStudentLogoutClient(params);
    return response;
  } catch (error) {
    console.log(error);
  }
};
