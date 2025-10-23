import { z } from "zod";

const toggleBookmark = z.object({
  body: z.object({
    referenceId: z.string({
      required_error: "Reference ID is required",
    }),
  }),
});

export const BookmarkValidation = {
  toggleBookmark,
};
