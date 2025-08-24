import { getDashboard } from "../service";
import { getDashboardData } from "./DashboardSlice";

export const getDashboardthunks = (params: any) => async (dispatch: any) => {
	try {
		const response = await getDashboard(params);
		dispatch(getDashboardData(response?.data?.data));
	} catch (error) {
		console.log(error);
	}
};