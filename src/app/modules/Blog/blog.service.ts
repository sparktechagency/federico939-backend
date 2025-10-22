import AppError from "../../errors/AppError";
import { BLOG_CATEGORY } from "./blog.constant";
import { TBlog } from "./blog.interface";
import { Blog } from "./blog.model";

const createBlogToDB = async (payload: TBlog) => {

    const validCategories = [BLOG_CATEGORY.ANXITY_BLOG, BLOG_CATEGORY.FEAR_BLOG, BLOG_CATEGORY.PRODUCTIVITY_BLOG, BLOG_CATEGORY.SLEEP_BLOG, BLOG_CATEGORY.STRESS_BLOG];

    if (!validCategories.includes(payload.category)) {
        throw new AppError(400, "Category must'be valid enum values")
    }

    const result = await Blog.create(payload);
    if (!result) {
        throw new AppError(400, "Failed to create blog");
    };
    return result;
};

export const BlogServices={
    createBlogToDB,
};

