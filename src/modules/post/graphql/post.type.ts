import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { UserGqlType } from "../../user/graphql/user.type";

export const PostGqlType = new GraphQLObjectType({
  name: "PostType",
  fields: {
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    attachment: { type: new GraphQLList(GraphQLString) },
    reactionsCount: { type: GraphQLInt },
    commentsCount: { type: GraphQLInt },
    sharesCount: { type: GraphQLInt },
    user: {
      type: UserGqlType,
      resolve: (parent: any) => {
        return parent.userId;
      },
    },
  },
});
