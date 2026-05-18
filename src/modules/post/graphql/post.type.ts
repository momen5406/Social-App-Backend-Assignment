import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const PostType = new GraphQLObjectType({
  name: "UserQuery",
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    userId: { type: GraphQLID },
  },
});
