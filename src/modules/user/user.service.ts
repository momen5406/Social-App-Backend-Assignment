import { Types } from "mongoose";
import { ICloudProvider } from "../../common/cloud/cloud.interface";
import { s3CloudProvider } from "../../common/cloud/s3/init";
import { UserRepository, userRepository } from "../../DB/models/user/user.repository";
import { NotFoundException } from "../../common";

class UserService {
  constructor(
    private readonly cloudProvider: ICloudProvider,
    private readonly userRepository: UserRepository
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
    return await this.userRepository.getOne({ _id: userId });
  }
}

export default new UserService(s3CloudProvider, userRepository);
