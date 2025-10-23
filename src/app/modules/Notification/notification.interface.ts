import { Model, Types } from "mongoose";
import { NOTIFICATION_TYPE } from "./notification.constant";

export type INotification = {
    text: string;
    receiver?: Types.ObjectId;
    read: boolean;
    referenceId?: string;
    type?: NOTIFICATION_TYPE;
};

export type NotificationModel = Model<INotification>;
