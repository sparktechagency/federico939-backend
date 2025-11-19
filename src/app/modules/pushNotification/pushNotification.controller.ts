import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { sendToTopic } from '../services/fcm.service';
import sendResponse from '../../utils/sendResponse';
import { PushNotification } from './pushNotification.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { cleanQuery } from '../Doctors/doctor.utils';


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

  console.log('req?.query push', req?.query)
  const query = cleanQuery(req?.query);
  const resultQuery = new QueryBuilder(
    PushNotification.find().sort({ createdAt: -1 }),
    req?.query,
  )
    .filter()    
    .paginate()
    .limit()
    .fields();

  const result = await resultQuery.modelQuery;
  console.log(' result', result?.length)
  const meta = await resultQuery.countTotal();

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