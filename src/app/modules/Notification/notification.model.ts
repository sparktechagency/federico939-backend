import { model, Schema } from 'mongoose';
import { TNotification } from './notification.interface';
import { NOTIFICATION_TYPE } from './notification.constant';

const notificationSchema = new Schema<TNotification>(
  {
    text: {
      type: String,
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referenceId: {
      type: String,
      required: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPE),
      required: false,
    },
    data: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Notification = model<TNotification>(
  'Notification',
  notificationSchema,
);
