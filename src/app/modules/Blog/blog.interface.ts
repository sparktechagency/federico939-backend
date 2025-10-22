import { BLOG_CATEGORY } from './blog.constant';

export interface TBlog {
  title: string;
  description: string;
  category: BLOG_CATEGORY;
  thumbnail: string;
  authorName: string;
  authorImage: string;
}
