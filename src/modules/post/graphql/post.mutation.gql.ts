import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import postService from "../post.service";
import { PostGqlType } from "./post.type.gql";
import { Types } from "mongoose";
import { PostRepository } from "../../../DB/models/post/post.repository";
import { isAuthGQL, isValidGQL } from "../../../middleware";
import z from "zod";
import { createPostSchema } from "../post.dto";

export const PostGqlMutation = {
  addPost: {
    type: PostGqlType,
    args: {
      title: { type: GraphQLString },
      attachments: { type: new GraphQLList(GraphQLString) },
    },
    resolve: async (_: any, args: { title: string; attachments: string[] }, context: any) => {
      isAuthGQL(context);
      await isValidGQL(createPostSchema, args);
      return await postService.create(args, new Types.ObjectId(context.payload.sub));
    },
  },
  updatePost: {
    type: PostGqlType,
    args: {
      title: { type: GraphQLString },
      attachments: { type: new GraphQLList(GraphQLString) },
      postId: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_: any, args: { title: string; attachments: string[]; postId: string }) => {
      const postRepo = new PostRepository();
      return await postRepo.updateOne({ _id: args.postId }, args, { returnDocument: "after" });
    },
  },
  deletePost: {
    type: GraphQLBoolean,
    args: {
      postId: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_: any, args: { postId: string }, context: any) => {
      isAuthGQL(context);
      const userId = context.payload.sub;
      const postRepo = new PostRepository();
      const { deletedCount } = await postRepo.deleteOne({ _id: args.postId, userId });
      return !!deletedCount;
    },
  },
};
