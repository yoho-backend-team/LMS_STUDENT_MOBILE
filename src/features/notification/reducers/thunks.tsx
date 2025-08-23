
import { getAllNotification } from "../services"
import { getNotifications } from "./notificationSlice"

export const getAllNotificationsThunk=(params:any)=>async (dispatch:any)=>{
    try{
        const response =await getAllNotification(params)
        console.log(response,'notification data')
        dispatch(getNotifications(response?.data));
    }
    catch(error){
        console.log(error,'notification error')
    }
}