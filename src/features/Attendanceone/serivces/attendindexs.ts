import Client from "../../../api/index"

export const getattendancedata = async (params: any) => {

  const response = await Client.student.attendance.get(params)
  if (response) {
    return response?.data;
  }

}
export const getattendancedatabyDate = async (params: any) => {
  const response = await Client.student.attendance.getByDate(params)
  if (response) {
    return response?.data;
  }
}