/* eslint-disable @typescript-eslint/no-explicit-any */
import Client from '../../../api/index';

export const getStudentLoginClient = async (data: any, params: any) => {
	const response = await Client.student.login(data, params);
	if (response) {
		return response;
	}
};

export const getStudentLogoutClient = async (params: any) => {
	const response = await Client.student.logouts(params)
	if (response) {
		return response;
	}
};

export const forgotPasswordClient = async (data: any, params: any) => {
	const response = await Client.student.forgetPassword(data, params)
	return response
}

export const updateVerifyOtpClient = async (data: any, params: any) => {
	const response = await Client.student.verifyOtp(data, params)
	if (response) {
		return response;
	}
}

export const resetpasswordClient = async (data: any, params: any) => {
	const response = await Client.student.reset_password(data, params)
	if (response) {
		return response;
	}
}