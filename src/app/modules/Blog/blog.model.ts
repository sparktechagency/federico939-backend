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
    categoryName: {
      type: String,
      required: false,
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
    isLatest: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Blog = model('Blog', blogSchema);
