import { Types } from "mongoose";
import commentService from "../comment.service";
import { CommentGqlType } from "./comment.type.gql";

export const CommentGqlQuery = {
  comment: {
    type: CommentGqlType,
    resolve: async () => {
      return await commentService.getOne(new Types.ObjectId("69ea72aa111bb883b9ceb8a8"));
    },
  },
};
