import { MOOD_TYPE, SOURCE } from './moodTracker.constant';
import { TMoodTracker } from './moodTracker.interface';
import { startOfDay, endOfDay } from 'date-fns';
import { MoodTracker } from './moodTracker.model';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';

const CreateOrUpdateMoodTrackerToDB = async (
  userId: string,
  payload: TMoodTracker,
) => {
  const validSource = [SOURCE.HOME, SOURCE.SELF_ASSESSMENT];
  const validMoodType = [
    MOOD_TYPE.ANXITY,
    MOOD_TYPE.DEPRESSION,
    MOOD_TYPE.HAPPY,
    MOOD_TYPE.NO_MOTIVATION,
    MOOD_TYPE.PERSONALITY,
    MOOD_TYPE.SAD,
    MOOD_TYPE.SLEEPY,
    MOOD_TYPE.STRESSED,
  ];

  if (payload.moodType && !validMoodType.includes(payload.moodType)) {
    throw new AppError(400, 'Mood type is not a valid enum value');
  }

  if (payload.source && !validSource.includes(payload.source)) {
    throw new AppError(400, 'Source is not a valid enum value');
  }

  const titleMap: Record<MOOD_TYPE, string> = {
    [MOOD_TYPE.ANXITY]: 'Severe Anxiety',
    [MOOD_TYPE.DEPRESSION]: 'Depression',
    [MOOD_TYPE.HAPPY]: 'Happy',
    [MOOD_TYPE.NO_MOTIVATION]: 'No Motivation',
    [MOOD_TYPE.PERSONALITY]: 'Personality',
    [MOOD_TYPE.SAD]: 'Sad',
    [MOOD_TYPE.SLEEPY]: 'Sleepy',
    [MOOD_TYPE.STRESSED]: 'Stressed',
  };

  const title = payload.moodType ? titleMap[payload.moodType] : undefined;

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const existing = await MoodTracker.findOne({
    userId,
    createdAt: { $gte: todayStart, $lte: todayEnd },
  });

  if (payload.moodType && existing) {
    existing.moodType = payload.moodType;
    existing.source = payload.source;
    existing.title = title;
    await existing.save();
    return existing;
  }

  if (payload.moodType) {
    const newMood = await MoodTracker.create({
      userId,
      title,
      moodType: payload.moodType,
      source: payload.source,
    });
    return newMood;
  }

  return null;
};

const getMyMoodTrackerHistoriesFromDB = async (userId: string, query: any) => {
  const baseQuery = MoodTracker.find({ userId });

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .search(['name', 'email', 'subject', 'userId'])
    .sort()
    .fields()
    .filter()
    .paginate();

  const result = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  if (!result || result.length === 0) {
    return {
      data: [],
      meta,
    };
  }

  const groupedData = result.reduce((acc: any, item: any) => {
    const dateKey = new Date(item.createdAt).toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
      .replace(/ /g, ' ');
  };

  const formattedData = Object.keys(groupedData)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map((date) => ({
      date: formatDate(date),
      items: groupedData[date],
    }));

  return {
    data: formattedData,
    meta,
  };
};

const getAllMoodTrackerHistoriesFromDB = async (query: any) => {
  const baseQuery = MoodTracker.find().populate({
    path: 'userId',
    select: '_id name role profileImage',
  });

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .search(['name email subject userId'])
    .sort()
    .fields()
    .filter()
    .paginate();

  const result = await queryBuilder.modelQuery;

  const meta = await queryBuilder.countTotal();

  if (!result || result.length === 0) {
    return [];
  }

  return {
    data: result,
    meta,
  };
};

const deleteMoodTrackerHistoryByIdFromDB = async (id: string) => {
  const result = await MoodTracker.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(400, 'Failed to delete mood tracker history by this ID');
  }

  return result;
};

export const MoodTrackerServices = {
  CreateOrUpdateMoodTrackerToDB,
  getMyMoodTrackerHistoriesFromDB,
  getAllMoodTrackerHistoriesFromDB,
  deleteMoodTrackerHistoryByIdFromDB,
};
