
import { getAllNotification } from "../services"
import { getNotifications } from "./notificationSlice"

export const getAllNotificationsThunk=(params:any)=>async (dispatch:any)=>{
    try{
        const response =await getAllNotification(params)
        
        dispatch(getNotifications(response?.data?.data));
    }
    catch(error){
        console.log(error,'notification error')
    }
}