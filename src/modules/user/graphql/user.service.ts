import { User } from "../../../DB/models/user/user.model";

export const getUser = async () => {
  return { id: 1, name: "test", email: "test@gmail.com", password: "asdf", phone: "123" };
};

export const createUser = async (parent: any, args: any) => {
  return await User.create(args);
};
