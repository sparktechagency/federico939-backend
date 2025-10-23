import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { BlogBookmark } from '../BlogBookmark/blogBookmark.model';
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

    const result = await Blog.create(payload);

    if (!result) {
        throw new AppError(400, 'Failed to create blog');
    }

    return result;
};



const getAllBLogsFromDB = async (query: any) => {
    const baseQuery = Blog.find();

    const queryBuilder = new QueryBuilder(baseQuery, query).search(["title", "authorName", "category"])
        .sort()
        .fields()
        .filter()
        .paginate()

    const blogs = await queryBuilder.modelQuery;

    const meta = await queryBuilder.countTotal();


    if (!blogs || blogs.length === 0) {
        throw new AppError(404, 'No blogs are found in the database');
    }

    return {
        data: blogs,
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
        throw new AppError(404, 'No blog found in the database by this ID');
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
