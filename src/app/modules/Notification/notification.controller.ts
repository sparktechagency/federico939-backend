import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationServices } from './notification.service';

const adminNotification = catchAsync(async (req, res) => {
  const result = await NotificationServices.adminNotificationFromDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin notifications are retrieved successfully',
    data: result,
  });
});

const adminReadNotification = catchAsync(async (req, res) => {
  const result = await NotificationServices.adminReadNotificationToDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Admin notifications are read successfully',
    data: result,
  });
});

const userNotification = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const result = await NotificationServices.userNotificationFromDB(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User notifications are retrieved successfully',
    data: result,
  });
});

const userReadNotification = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const result = await NotificationServices.userReadNotificationToDB(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User notifications are read successfully',
    data: result,
  });
});

export const NotificationControllers = {
  adminNotification,
  adminReadNotification,
  userNotification,
  userReadNotification,
};
