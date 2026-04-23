import z from "zod";
import { BadRequestException, SYS_REACTIONS } from "../../common";
import { Types } from "mongoose";

export interface CreatePostDTO {
  content?: string;
  attachments?: string[];
}

export const createPostSchema = z
  .object({
    content: z.string().optional(),
    attachments: z.array(z.string()).optional(),
  })
  .refine((data) => {
    const { attachments, content } = data;
    if (!content && (!attachments || attachments.length === 0))
      throw new BadRequestException("Content or Attachments must be provided.");
    return true;
  });

export interface AddReactionDTO {
  postId: Types.ObjectId;
  reaction: SYS_REACTIONS;
}
