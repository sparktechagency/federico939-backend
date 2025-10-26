import { Audio } from "../AudioCollections/audio.model"
import { Blog } from "../Blog/blog.model"
import { Doctor } from "../Doctors/doctor.model"
import { STATUS } from "../User/user.constant"
import { User } from "../User/user.model"

const getStatsFromDB = async () => {
    const [userCount, blogCount, doctorCount, audioCount] = await Promise.all([
        User.countDocuments({ verified: true, active: STATUS.ACTIVE }),
        Blog.countDocuments(),
        Doctor.countDocuments(),
        Audio.countDocuments()
    ]);

    const result = {
        totalUser: userCount,
        totalBlog: blogCount,
        totalDoctor: doctorCount,
        totalAudio: audioCount
    };

    return result;
};

export const AnalyticsServices={
    getStatsFromDB,
}