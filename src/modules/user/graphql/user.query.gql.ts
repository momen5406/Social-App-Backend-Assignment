import { GraphQLID, GraphQLString } from "graphql";
import { UserGqlType } from "./user.type";
import userService from "../user.service";
import { Types } from "mongoose";

export const UserGqlQuery = {
  user: {
    type: UserGqlType,
    resolve: async () => {
      return await userService.profile(new Types.ObjectId("69ea1d0391a581efbc2436b0"));
    },
  },
};
