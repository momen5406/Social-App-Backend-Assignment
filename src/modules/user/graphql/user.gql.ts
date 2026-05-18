import { GraphQLID, GraphQLString } from "graphql";
import { createUser, getUser } from "./user.service";
import { UserType } from "./user.type";

export const userQuery = {
  user: {
    type: UserType,
    resolve: getUser,
  },
};

export const UserMutation = {
  createUser: {
    type: UserType,
    args: {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      phone: { type: GraphQLString },
    },
    resolve: createUser,
  },
};
