// src/app/modules/audio/audio.service.ts
import { AudioCategory, IAudio } from './audio.interface';
import { Audio } from './audio.model';

// 🆕 Create
const createAudio = async (payload: IAudio) => {
  const result = await Audio.create(payload);
  return result;
};

// 🧾 Get All with pagination, category filtering
const getAllAudio = async (query: Record<string, unknown>) => {
  const { page = 1, limit = 10, audio_category } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: Record<string, unknown> = {};

  if (audio_category && audio_category !== AudioCategory.LATEST_AUDIO) {
    filter.audio_category = audio_category;
  }

  let result;

  // 🌀 Handle LATEST_AUDIO
  if (audio_category === AudioCategory.LATEST_AUDIO) {
    const latestCount = query.latestCount ? Number(query.latestCount) : 3;
    result = await Audio.find({})
      .sort({ createdAt: -1 })
      .limit(latestCount)
      .lean();
  }
  // 🎧 Handle DAILY_AUDIO random logic (simplified)
  else if (audio_category === AudioCategory.DAILY_AUDIO) {
    // Check if dashboard audio available (pseudo logic)
    const dashboardAudio = await Audio.findOne({
      audio_category: 'DAILY_AUDIO',
    });
    if (dashboardAudio) {
      result = [dashboardAudio];
    } else {
      const count = await Audio.countDocuments({});
      const random = Math.floor(Math.random() * count);
      result = await Audio.find({}).skip(random).limit(1);
    }
  } else {
    result = await Audio.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
  }

  const total = await Audio.countDocuments(filter);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
    },
    data: result,
  };
};

// 🔍 Get Single
const getSingleAudio = async (id: string) => {
  const result = await Audio.findById(id);
  return result;
};

// 🧩 Update
const updateAudio = async (id: string, payload: Partial<IAudio>) => {
  const result = await Audio.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

// ❌ Delete
const deleteAudio = async (id: string) => {
  const result = await Audio.findByIdAndDelete(id);
  return result;
};

// 🌟 Get Special Audio (custom logic placeholder)
const getSpecialAudio = async () => {
  const result = await Audio.find({}).limit(5);
  return result;
};

export const AudioService = {
  createAudio,
  getAllAudio,
  getSingleAudio,
  updateAudio,
  deleteAudio,
  getSpecialAudio,
};
