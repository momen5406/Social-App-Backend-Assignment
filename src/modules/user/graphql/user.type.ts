import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const UserGqlType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    _id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    phone: { type: GraphQLString },
    role: { type: GraphQLString },
    provider: { type: GraphQLString },
    gender: { type: GraphQLString },
  },
});
