import Client from '../../../api/index';

export const getAllNotification = async (params: any) => {
  const response = await Client.student.notification.get(params);
  if (response) {
    return response;
  }
};

export const updateNotificationStatus = async (data: any) => {
  const response = await Client.student.notification.update(data);
  if (response) {
    return response;
  }
};

export const deleteNotification = async (data: any) => {
  const response = await Client.student.notification.delete(data);
  if (response) {
    return response;
  }
};
