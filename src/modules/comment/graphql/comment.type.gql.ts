import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UserGqlType } from "../../user/graphql/user.type";
import { PostGqlType } from "../../post/graphql/post.type.gql";

export const CommentGqlType = new GraphQLObjectType({
  name: "CommentType",
  fields: {
    user: {
      type: UserGqlType,
      resolve: (parent: any) => {
        return parent.userId;
      },
    },
    post: {
      type: PostGqlType,
      resolve: (parent: any) => {
        return parent.postId;
      },
    },
    mentions: { type: new GraphQLList(UserGqlType) },
    content: { type: GraphQLString },
    attachments: { type: new GraphQLList(GraphQLString) },
    reactionsCount: { type: GraphQLInt },
  },
});
