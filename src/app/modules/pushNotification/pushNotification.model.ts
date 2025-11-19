import { model, Schema } from "mongoose";

export interface IPushNotification {
  title: string;  
  body: string;
  topic: "all_users";  
  createdAt?: Date;
  updatedAt?: Date;
}

const pushNotificationSchema = new Schema<IPushNotification>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },    
    topic: {
      type: String,      
      default: "all_users",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const PushNotification = model<IPushNotification>(
  "PushNotification",
  pushNotificationSchema
);
