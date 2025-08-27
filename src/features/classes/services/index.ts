import Client from '../../../api/index'

export const getLiveClassDetails = async(params: any) => {
        const response = await Client.student.class.get(params);
        // console.log("service....",response);
        if(response)
        return response?.data;  
}
