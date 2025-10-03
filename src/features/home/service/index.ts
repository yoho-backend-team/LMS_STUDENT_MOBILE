import Client from "../../../api/index"

export const getDashboard = async (params: any) => {
	const response = await Client.student.reports.get()
	if (response) {
		return response;
	}
}

export const getDashboardAssement = async (params?: any) => {
	const res = await Client.student.reports.getassement(params)
	if (res) {
		return res
	}
}