// src/app/modules/audio/audio.service.ts
import path from 'path';
import { AudioCategory, IAudio } from './audio.interface';
import { Audio } from './audio.model';
import { parseFile } from 'music-metadata';

// 🆕 Create
const createAudio = async (payload: IAudio) => {
  if (payload.audio) {
    let fullPath: string;

    fullPath = path.join(
      process.cwd(),
      'uploads',
      'audio',
      path.basename(payload.audio),
    );

    const metadata = await parseFile(fullPath);
    const durationInSeconds = metadata.format.duration;
    if (durationInSeconds) {
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = Math.floor(durationInSeconds % 60);

      // Format with leading zeros
      const mm = String(minutes).padStart(2, '0');
      const ss = String(seconds).padStart(2, '0');

      payload.duration = `${mm}:${ss}`;
    }
  }

  const result = await Audio.create(payload);
  return result;
};

// 🧾 Get All with pagination, category filtering
const getAllAudio = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const audioCategory = query.audio_category as string | undefined;

  /**
   * 🎵 LATEST AUDIO
   */
  if (audioCategory === AudioCategory.LATEST_AUDIO) {
    const latestCount = Number(query.latestCount) || 3;

    const data = await Audio.find()
      .sort({ createdAt: -1 })
      .limit(latestCount)
      .lean();

    return { meta: null, data };
  }

  /**
   * 🎧 DAILY AUDIO
   */
  if (audioCategory === AudioCategory.DAILY_AUDIO) {
    const fixedAudio = await Audio.findOne({
      category: AudioCategory.DAILY_AUDIO,
    }).lean();

    if (fixedAudio) {
      return { meta: null, data: [fixedAudio] };
    }

    const total = await Audio.countDocuments();
    const randomSkip = Math.floor(Math.random() * total);

    const randomAudio = await Audio.find().skip(randomSkip).limit(1).lean();

    return { meta: null, data: randomAudio };
  }

  /**
   * 📀 NORMAL LIST
   */
  const filter: Record<string, unknown> = {};

  if (audioCategory) {
    filter.category = audioCategory; // ✅ FIXED
  }

  const data = await Audio.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Audio.countDocuments(filter);

  return {
    meta: { page, limit, total },
    data,
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
