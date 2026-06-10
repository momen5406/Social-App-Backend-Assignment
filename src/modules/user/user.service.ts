import { Types } from "mongoose";
import { ICloudProvider } from "../../common/cloud/cloud.interface";
import { s3CloudProvider } from "../../common/cloud/s3/init";
import { UserRepository, userRepository } from "../../DB/models/user/user.repository";
import { NotFoundException } from "../../common";
import { userFriendRepository, UserFriendRepository } from "../../DB/models/userFriend/userFriend.repository";

class UserService {
  constructor(
    private readonly cloudProvider: ICloudProvider,
    private readonly userRepository: UserRepository,
    private readonly userFriendRepository: UserFriendRepository
  ) {}

  async uploadProfilePic(file: Express.Multer.File, userId: Types.ObjectId) {
    const { key, url } = await this.cloudProvider.uploadFile(file, `users/${userId.toString()}`);
    const user = await this.userRepository.updateOne(
      { _id: userId },
      { profilePic: url },
      { returnDocument: "before" }
    );
    if (!user) throw new NotFoundException("User not found");
    if (user.profilePic) await this.cloudProvider.deleteFile(user.profilePic);
  }

  async profile(userId: Types.ObjectId) {
    const user = await this.userRepository.getOne({ _id: userId });
    const friends = await this.userFriendRepository.getAll(
      { $or: [{ user: userId }, { friend: userId }] },
      {},
      { populate: [{ path: "user" }, { path: "friend" }] }
    );
    return { user, friends };
  }
}

export default new UserService(s3CloudProvider, userRepository, userFriendRepository);
