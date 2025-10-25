import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { sendNotifications } from '../../helpers/notificationHelper';
import { BlogBookmark } from '../BlogBookmark/blogBookmark.model';
import { NOTIFICATION_TYPE } from '../Notification/notification.constant';
import { STATUS } from '../User/user.constant';
import { User } from '../User/user.model';
import { BLOG_CATEGORY } from './blog.constant';
import { TBlog } from './blog.interface';
import { Blog } from './blog.model';

const createBlogToDB = async (payload: TBlog) => {
    const validCategories = [
        BLOG_CATEGORY.ANXITY_BLOG,
        BLOG_CATEGORY.FEAR_BLOG,
        BLOG_CATEGORY.PRODUCTIVITY_BLOG,
        BLOG_CATEGORY.SLEEP_BLOG,
        BLOG_CATEGORY.STRESS_BLOG,
    ];

    if (!validCategories.includes(payload.category)) {
        throw new AppError(400, "Category must'be valid enum values");
    }

    const categoryMap: Record<BLOG_CATEGORY, string> = {
        [BLOG_CATEGORY.ANXITY_BLOG]: "Anxity",
        [BLOG_CATEGORY.FEAR_BLOG]: "Fear",
        [BLOG_CATEGORY.PRODUCTIVITY_BLOG]: "Productivity",
        [BLOG_CATEGORY.SLEEP_BLOG]: "Sleep",
        [BLOG_CATEGORY.STRESS_BLOG]: "Stress"
    }

    const categoryName = categoryMap[payload.category]

    payload.categoryName = categoryName

    const result = await Blog.create(payload);

    // Fetch only verified & active users
    const users = await User.find(
        { verified: true, status: STATUS.ACTIVE },
        '_id',
    );

    // Send notification to those users
    await Promise.all(
        users.map(user =>
            sendNotifications({
                receiver: user._id,
                text: 'New blog published!',
                message: `${result.title} is now available to read.`,
                type: NOTIFICATION_TYPE.USER,
                data: result,
            }),
        ),
    );


    if (!result) {
        throw new AppError(400, 'Failed to create blog');
    }

    return result;
};



const getAllBLogsFromDB = async (userId: string, query: any) => {
    const baseQuery = Blog.find();

    const queryBuilder = new QueryBuilder(baseQuery, query).search(["title", "authorName", "category"])
        .sort()
        .fields()
        .filter()
        .paginate()

    const blogs = await queryBuilder.modelQuery.lean();

    const meta = await queryBuilder.countTotal();


    if (!blogs || blogs.length === 0) {
        return []
    }

    const withBookmark = await Promise.all(
        blogs.map(async (blog) => {
            const isBookmarked = await BlogBookmark.exists({
                userId,
                referenceId: blog._id,
            });

            return {
                ...blog,
                isBookmarked: !!isBookmarked,
            }
        })

    )

    return {
        data: withBookmark,
        meta,
    };
};

const getBlogByIdFromDB = async (userId: string, id: string) => {
    const blog = await Blog.findById(id).lean();

    const isBookmarked = await BlogBookmark.exists({
        userId,
        referenceId: id,
    });


    if (!blog) {
        return {}
    }

    return {
        ...blog,
        isBookmarked: !!isBookmarked,
    };
};

const updateBlogByIdToDB = async (id: string, payload: Partial<TBlog>) => {
    const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { $set: payload },
        { new: true, runValidators: true },
    );

    if (!updatedBlog) {
        throw new AppError(404, 'No blog found or failed to update');
    }

    return updatedBlog;
};

const deleteBlogByIdFromDB = async (id: string) => {
    const result = await Blog.findByIdAndDelete(id);

    if (!result) {
        throw new AppError(400, 'Failed to delete this blog by ID');
    }

    return result;
};

export const BlogServices = {
    createBlogToDB,
    getAllBLogsFromDB,
    getBlogByIdFromDB,
    updateBlogByIdToDB,
    deleteBlogByIdFromDB,
};
