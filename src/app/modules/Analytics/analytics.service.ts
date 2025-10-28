import dayjs from 'dayjs';
import { Audio } from '../AudioCollections/audio.model';
import { Blog } from '../Blog/blog.model';
import { Doctor } from '../Doctors/doctor.model';
import { STATUS } from '../User/user.constant';
import { User } from '../User/user.model';

const getStatsFromDB = async () => {
  const [userCount, blogCount, doctorCount, audioCount] = await Promise.all([
    User.countDocuments({ status: STATUS.ACTIVE, verified: true }),
    Blog.countDocuments(),
    Doctor.countDocuments(),
    Audio.countDocuments(),
  ]);

  const result = {
    totalUser: userCount,
    totalBlog: blogCount,
    totalDoctor: doctorCount,
    totalAudio: audioCount,
  };

  return result;
};

const getMonthlyUserStatsFromDB = async (year?: number) => {
  const selectedYear = year || dayjs().year();

  const startOfYear = dayjs(`${selectedYear}-01-01`).startOf('year').toDate();
  const endOfYear = dayjs(`${selectedYear}-12-31`).endOf('year').toDate();

  const stats = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear, $lte: endOfYear },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        totalUsers: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: '$_id.month',
        totalUsers: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const result = monthNames.map((name, index) => {
    const found = stats.find((s) => s.month === index + 1);
    return {
      month: name,
      totalUsers: found ? found.totalUsers : 0,
    };
  });

  return result;
};

export const AnalyticsServices = {
  getStatsFromDB,
  getMonthlyUserStatsFromDB,
};
