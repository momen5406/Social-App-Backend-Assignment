import { SYS_GENDER, SYS_PROVIDER, SYS_ROLE } from "../enums";

export interface IUser {
  username: string;
  email: string;
  password: string;
  phone?: string;
  role: SYS_ROLE;
  gender: SYS_GENDER | undefined;
  provider: SYS_PROVIDER;
  profilePic: string;
}
