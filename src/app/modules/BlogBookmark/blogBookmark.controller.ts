import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BlogBookmarkServices } from "./blogBookmark.service";

const toggleBlogBookmark = catchAsync(async (req, res) => {
  const { id } = req.user as { id: string };
  const { referenceId } = req.body as {
    referenceId: string;
  };

  const result = await BlogBookmarkServices.toggleBlogBookmark({
    userId: id,
    referenceId,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message || "Bookmark toggled successfully",
    data: result,
  });
});

const getBookmark = catchAsync(async (req, res) => {
  const { id } = req.user as { id: string };
  const result = await BlogBookmarkServices.getBlogBookmarkFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookmarks Retrieved Successfully",
    data: result,
  });
});

const deleteBookmark = catchAsync(async (req, res) => {
  const { id } = req.user as { id: string };
  const { referenceId } = req.params as {
    referenceId: string;
  };

  const result = await BlogBookmarkServices.deleteBlogBookmarkByIdFromDB(id, referenceId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookmark deleted successfully",
    data: result,
  });
});

export const BlogBookmarkControllers = {
  toggleBlogBookmark,
  getBookmark,
  deleteBookmark,
};