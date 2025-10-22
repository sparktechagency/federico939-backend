// src/app/modules/audio/audio.controller.ts
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AudioService } from './audio.service';

// 🎵 Create Audio
const createAudio = catchAsync(async (req, res) => {
  const result = await AudioService.createAudio(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Audio created successfully',
    data: result,
  });
});

// 🎧 Get All Audio
const getAllAudio = catchAsync(async (req, res) => {
  const result = await AudioService.getAllAudio(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Audios retrieved successfully',
    data: result,
  });
});

// 🎼 Get Single Audio
const getSingleAudio = catchAsync(async (req, res) => {
  const result = await AudioService.getSingleAudio(req.params.audio_id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single audio retrieved successfully',
    data: result,
  });
});

// 💎 Get Special Audio
const getSpecialAudio = catchAsync(async (req, res) => {
  const result = await AudioService.getSpecialAudio();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Special audios retrieved successfully',
    data: result,
  });
});

// ✏️ Update Audio
const updateAudio = catchAsync(async (req, res) => {
  const result = await AudioService.updateAudio(req.params.audio_id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Audio updated successfully',
    data: result,
  });
});

// 🗑️ Delete Audio
const deleteAudio = catchAsync(async (req, res) => {
  const result = await AudioService.deleteAudio(req.params.audio_id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Audio deleted successfully',
    data: result,
  });
});

export const AudioController = {
  createAudio,
  getAllAudio,
  getSingleAudio,
  getSpecialAudio,
  updateAudio,
  deleteAudio,
};
