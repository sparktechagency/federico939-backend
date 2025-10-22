import { model, Schema } from 'mongoose';
import { TBlog } from './blog.interface';
import { BLOG_CATEGORY } from './blog.constant';

const blogSchema = new Schema<TBlog>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(BLOG_CATEGORY),
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
      default: '',
    },
    authorName: {
      type: String,
      required: true,
    },
    authorImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Blog = model('Blog', blogSchema);
