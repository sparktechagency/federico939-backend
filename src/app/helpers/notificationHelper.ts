import { TNotification } from '../modules/Notification/notification.interface';
import { Notification } from '../modules/Notification/notification.model';

export const sendNotifications = async (data: any): Promise<TNotification> => {
  const result = await Notification.create(data);

  //@ts-ignore
  const socketIo = global.io;

  if (socketIo) {
    socketIo.emit(`send-notification::${data?.receiver}`, result);
  }

  return result;
};
