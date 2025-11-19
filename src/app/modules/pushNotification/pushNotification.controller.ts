import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { sendToTopic } from '../services/fcm.service';
import sendResponse from '../../utils/sendResponse';
import { PushNotification } from './pushNotification.model';
import QueryBuilder from '../../builder/QueryBuilder';


const sendPushNotificationController = catchAsync(async (req, res) => {


  const { topic, title, body } = req.body;
  const result = await sendToTopic({
    topic,
    notification: { title, body },
    // data,
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Push notification sent successfully',
    data: result,
  });
});


const getAllPushNotifications = catchAsync(async (req, res) => {
  const query = new QueryBuilder(
    PushNotification.find(),
    req.query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await query.modelQuery;
  const meta = await query.countTotal();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Push notifications retrieved successfully",
    data: result,
    meta,
  });
});

export const PushNotificationControllers = {
  sendPushNotificationController,
  getAllPushNotifications
};