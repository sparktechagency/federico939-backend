import { Model, Types } from 'mongoose';
import { NOTIFICATION_TYPE } from './notification.constant';

export type TNotification = {
  text: string;
  receiver?: Types.ObjectId;
  read: boolean;
  referenceId?: string;
  type?: NOTIFICATION_TYPE;
  data?: any;
};
