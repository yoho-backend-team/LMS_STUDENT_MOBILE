import Client from "../../../api/index"

export const getcoursedata = async (params: any) => {
  try {
    const response = await Client.student.course.get(params);
    return response?.data; 
  } catch (error) {
    console.error('Error in getcoursedata:', error);
    throw error;
  }
}

export const taskdataget =async (params:any)=>{
  try{
    const response =await Client.student.course.getTask(params);
    return response?.data;
  }
  catch(error){
    console.log('Error in taskdata',error);
  }
}

export const updatetaskdata = async (data:any)=>{
  try{
    const response = await Client.student.course.taskUpdate(data);
    return response?.data;
  }
  catch(error){
    console.log (' Failed updated task is error',error)
  }
}