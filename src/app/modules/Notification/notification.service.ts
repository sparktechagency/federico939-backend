import { NOTIFICATION_TYPE } from './notification.constant';
import { TNotification } from './notification.interface';
import { Notification } from './notification.model';

const adminNotificationFromDB = async () => {
  const result = await Notification.find({ type: NOTIFICATION_TYPE.ADMIN });
  return result;
};

// read notifications only for user
const adminReadNotificationToDB = async (): Promise<TNotification | null> => {
  const result: any = await Notification.updateMany(
    { type: NOTIFICATION_TYPE.ADMIN, read: false },
    { $set: { read: true } },
    { new: true },
  );
  return result;
};

// get user notifications by ID
const userNotificationFromDB = async (userId: string) => {
  const result = await Notification.find({
    receiver: userId,
    type: NOTIFICATION_TYPE.USER,
  });
  return result;
};

// read notifications only for user
const userReadNotificationToDB = async (
  userId: string,
): Promise<TNotification | null> => {
  const result: any = await Notification.updateMany(
    { receiver: userId, type: NOTIFICATION_TYPE.USER, read: false },
    { $set: { read: true } },
    { new: true },
  );
  return result;
};

export const NotificationServices = {
  adminNotificationFromDB,
  adminReadNotificationToDB,
  userNotificationFromDB,
  userReadNotificationToDB,
};
