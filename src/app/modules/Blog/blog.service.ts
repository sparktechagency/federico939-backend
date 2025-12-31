import QueryBuilder from '../../builder/QueryBuilder';
import { USER_ROLES } from '../../enums/user';
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
    [BLOG_CATEGORY.ANXITY_BLOG]: 'Anxity',
    [BLOG_CATEGORY.FEAR_BLOG]: 'Fear',
    [BLOG_CATEGORY.PRODUCTIVITY_BLOG]: 'Productivity',
    [BLOG_CATEGORY.SLEEP_BLOG]: 'Sleep',
    [BLOG_CATEGORY.STRESS_BLOG]: 'Stress',
  };

  const categoryName = categoryMap[payload.category];

  payload.categoryName = categoryName;

  const result = await Blog.create(payload);

  const users = await User.find(
    { verified: true, status: STATUS.ACTIVE },
    '_id',
  );

  await Promise.all(
    users.map((user) =>
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

const getLatestBlogFromDB = async (userId: string) => {
  const blog = await Blog.findOne({ isLatest: true }).sort('-createdAt');

  if (!blog) {
    return null;
  }

  const isBookmarked = await BlogBookmark.exists({
    userId,
    referenceId: blog._id,
  });

  return {
    ...blog.toObject(),
    isBookmarked: !!isBookmarked,
  };
};

// const getAllBLogsFromDB = async (userId: string, query: any) => {
//   const baseQuery = Blog.find({ isLatest: false });

//   const queryBuilder = new QueryBuilder(baseQuery, query)
//     .search(['title', 'authorName', 'category'])
//     .sort()
//     .fields()
//     .filter()
//     .paginate();

//   const blogs = await queryBuilder.modelQuery.lean();

//   const meta = await queryBuilder.countTotal();

//   if (!blogs || blogs.length === 0) {
//     return [];
//   }

//   const withBookmark = await Promise.all(
//     blogs.map(async (blog) => {
//       const isBookmarked = await BlogBookmark.exists({
//         userId,
//         referenceId: blog._id,
//       });

//       return {
//         ...blog,
//         isBookmarked: !!isBookmarked,
//       };
//     }),
//   );

//   return {
//     data: withBookmark,
//     meta,
//   };
// };

const getAllBLogsFromDB = async (userId: string, query: any) => {
  // user role fetch (single DB hit)
  const user = await User.findById(userId).select('role').lean();

  if (!user) {
    throw new Error('User not found');
  }

  // role-based filter
  const filter: any = {};
  console.log(filter);

  if (user.role !== USER_ROLES.SUPER_ADMIN && USER_ROLES.BLOG_ADMIN) {
    filter.isLatest = false;
  }

  //  base query
  const baseQuery = Blog.find(filter);

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .search(['title', 'authorName', 'category'])
    .sort()
    .fields()
    .filter()
    .paginate();

  const blogs = await queryBuilder.modelQuery.lean();
  const meta = await queryBuilder.countTotal();

  if (!blogs.length) {
    return { data: [], meta };
  }

  //  bookmark optimization (no N+1)
  const blogIds = blogs.map((b) => b._id);

  const bookmarks = await BlogBookmark.find({
    userId,
    referenceId: { $in: blogIds },
  }).select('referenceId');

  const bookmarkedSet = new Set(bookmarks.map((b) => b.referenceId.toString()));

  const withBookmark = blogs.map((blog) => ({
    ...blog,
    isBookmarked: bookmarkedSet.has(blog._id.toString()),
  }));

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
    return {};
  }

  return {
    ...blog,
    isBookmarked: !!isBookmarked,
  };
};

const updateBlogByIdToDB = async (id: string, payload: Partial<TBlog>) => {
  if (payload.category) {
    const validCategories = [
      BLOG_CATEGORY.ANXITY_BLOG,
      BLOG_CATEGORY.FEAR_BLOG,
      BLOG_CATEGORY.PRODUCTIVITY_BLOG,
      BLOG_CATEGORY.SLEEP_BLOG,
      BLOG_CATEGORY.STRESS_BLOG,
    ];

    if (!validCategories.includes(payload.category)) {
      throw new AppError(400, 'Category must be one of the valid enum values');
    }

    const categoryMap: Record<BLOG_CATEGORY, string> = {
      [BLOG_CATEGORY.ANXITY_BLOG]: 'Anxity',
      [BLOG_CATEGORY.FEAR_BLOG]: 'Fear',
      [BLOG_CATEGORY.PRODUCTIVITY_BLOG]: 'Productivity',
      [BLOG_CATEGORY.SLEEP_BLOG]: 'Sleep',
      [BLOG_CATEGORY.STRESS_BLOG]: 'Stress',
    };

    payload.categoryName = categoryMap[payload.category];
  }

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
  getLatestBlogFromDB,
};
