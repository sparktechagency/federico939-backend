import mongoose from "mongoose";
import { BlogBookmark } from "./blogBookmark.model";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const checkBlogBookmarkStatus = async (userId: string, referenceId: string) => {
  const bookmark = await BlogBookmark.findOne({
    userId,
    referenceId,
  });

  return { isBookmarked: !!bookmark };
};

const toggleBlogBookmark = async (payload: {
  userId: string;
  referenceId: string;
}) => {
  const { userId, referenceId } = payload;

  const existingBookmark = await BlogBookmark.findOne({
    userId,
    referenceId,
  });

  if (existingBookmark) {
    await BlogBookmark.deleteOne({ _id: existingBookmark._id });
    return {
      message: "Bookmark removed successfully",
      isBookmarked: false,
    };
  } else {
    const newBookmark = await BlogBookmark.create({
      userId,
      referenceId: new mongoose.Types.ObjectId(referenceId),
    });
    return {
      message: "Bookmark added successfully",
      isBookmarked: true,
      data: newBookmark,
    };
  }
};

const getBlogBookmarkFromDB = async (userId: string) => {
  const query: any = { userId };

  const bookmarks = await BlogBookmark.find(query)
    .populate({
      path: "userId",
      select: "name email profileImage role _id",
    })
    .populate("referenceId")
    .sort({ createdAt: -1 })
    .lean();

  const populatedBookmarks = await Promise.all(
    bookmarks.map(async (bookmark: any) => {
      const isBookmarked = await checkBlogBookmarkStatus(
        userId,
        bookmark.referenceId,
      );
      return {
        ...bookmark,
        isBookmarked: isBookmarked.isBookmarked,
      };
    }),
  );

  return populatedBookmarks;
};

const deleteBlogBookmarkByIdFromDB = async (userId: string, referenceId: string) => {
  const result = await BlogBookmark.deleteOne({
    userId,
    referenceId,
  });
  if (!result.deletedCount) {
    throw new AppError(StatusCodes.NOT_FOUND, "Bookmark not found");
  }
  return result;
};

export const BookmarkService = {
  toggleBlogBookmark,
  getBlogBookmarkFromDB,
  deleteBlogBookmarkByIdFromDB,
};

