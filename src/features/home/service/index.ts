import Client from "../../../api/index"

export const getDashboard = async (params: any) => {
  const response = await Client.student.reports.get()
  	if (response) {
		return response;
	}
}