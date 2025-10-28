import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserPromptServices } from './userPrompt.service';

const checkPrompts = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const result = await UserPromptServices.checkPrompts(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Successfully prompts retrieved successfully',
    data: result,
  });
});

const updatePaymentInterval = catchAsync(async (req, res) => {
  const { days } = req.body;
  const { id: userId } = req.user;
  const result = await UserPromptServices.updatePaymentIntervalToDB(
    userId,
    days,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Successfully update payment interval',
    data: result,
  });
});

export const UserPromptControllers = {
  checkPrompts,
  updatePaymentInterval,
};
