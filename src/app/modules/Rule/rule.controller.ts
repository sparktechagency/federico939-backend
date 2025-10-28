import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { RuleServices } from './rule.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

// privacy policy
const createPrivacyPolicy = catchAsync(async (req: Request, res: Response) => {
  const { ...privacyData } = req.body;
  const result = await RuleServices.createPrivacyPolicyToDB(privacyData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Privacy policy created successfully',
    data: result,
  });
});

const getPrivacyPolicy = catchAsync(async (req: Request, res: Response) => {
  const result = await RuleServices.getPrivacyPolicyFromDB();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Privacy policy retrieved successfully',
    data: result,
  });
});

// terms and conditions
const createTermsAndCondition = catchAsync(
  async (req: Request, res: Response) => {
    const { ...termsData } = req.body;
    const result = await RuleServices.createTermsAndConditionToDB(termsData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Terms and conditions created successfully',
      data: result,
    });
  },
);

const getTermsAndCondition = catchAsync(async (req: Request, res: Response) => {
  const result = await RuleServices.getTermsAndConditionFromDB();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Terms and conditions retrieved successfully',
    data: result,
  });
});

// about
const createAbout = catchAsync(async (req: Request, res: Response) => {
  const { ...aboutData } = req.body;
  const result = await RuleServices.createAboutToDB(aboutData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'About created successfully',
    data: result,
  });
});

const getAbout = catchAsync(async (req: Request, res: Response) => {
  const result = await RuleServices.getAboutFromDB();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'About retrieved successfully',
    data: result,
  });
});

export const RuleControllers = {
  createPrivacyPolicy,
  getPrivacyPolicy,
  createTermsAndCondition,
  getTermsAndCondition,
  createAbout,
  getAbout,
};
