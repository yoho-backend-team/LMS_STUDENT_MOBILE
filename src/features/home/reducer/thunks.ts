import { getDashboard, getDashboardAssement } from "../service";
import { getDashboardAssessmentData, getDashboardData } from "./DashboardSlice";

export const getDashboardthunks = (params: any) => async (dispatch: any) => {
	try {
		const response = await getDashboard(params);
		dispatch(getDashboardData(response?.data?.data));
	} catch (error) {
		console.log(error);
	}
};



export const getdashboardassementthunk = (params?: any) => async (dispatch: any) => {
  try {
    const res = await getDashboardAssement(params);
    dispatch(getDashboardAssessmentData(res?.data));
  } catch (error) {
    console.log(error);
  }
};