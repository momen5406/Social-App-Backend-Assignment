import { getPost } from "./post.service";
import { PostType } from "./post.type";

export const postQuery = {
  post: {
    type: PostType,
    resolve: getPost,
  },
};

export const PostMutation = {};
