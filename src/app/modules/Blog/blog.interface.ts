import { BLOG_CATEGORY } from './blog.constant';

export interface TBlog {
  _id:string;
  title: string;
  description: string;
  category: BLOG_CATEGORY;
  thumbnail: string;
  authorName: string;
  authorImage: string;
}
