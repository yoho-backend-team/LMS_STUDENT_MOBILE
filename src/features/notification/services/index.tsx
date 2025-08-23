
import Client from '../../../api/index'

export const getAllNotification = async (params:any)=>{
    const response =await Client.student.notification.get(params)
    if(response){
        return response;
    }
}