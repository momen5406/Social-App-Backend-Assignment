import { Types } from "mongoose";

export interface IComment {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  parentId?: Types.ObjectId | undefined;
  content?: string;
  attachments?: string;
  mentions?: Types.ObjectId[];
  reactionsCount: number;
}
