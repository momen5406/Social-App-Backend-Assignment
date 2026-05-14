import { IUserFriend } from "../../../common";
import { AbstractRepository } from "../../abstract.repository";
import { UserFriend } from "./userFriend.model";

export class UserFriendRepository extends AbstractRepository<IUserFriend> {
  constructor() {
    super(UserFriend);
  }
}

export const userFriendRepository = new UserFriendRepository();
