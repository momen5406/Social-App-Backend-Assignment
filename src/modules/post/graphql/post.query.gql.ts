import { Types } from "mongoose";
import postService from "../post.service";
import { PostGqlType } from "./post.type.gql";

export const PostGqlQuery = {
  post: {
    type: PostGqlType,
    resolve: () => {
      postService.getPost(new Types.ObjectId("69ea53da67badf2a7fbbf400"));
    },
  },
};
