import { Types } from "mongoose";
import { RequestRepository } from "./../../DB/models/request/request.repository";
import { BadRequestException, ConflictException, NotFoundException, UnAuthorizedException } from "../../common";
import { UserFriendRepository } from "../../DB/models/userFriend/userFriend.repository";

export class RequestService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly userFriendRepository: UserFriendRepository
  ) {}

  async sendRequest(senderId: Types.ObjectId, receiverId: Types.ObjectId) {
    if (senderId.toString() == receiverId.toString()) throw new BadRequestException("Not allowed to send request.");

    const isUserFriend = await this.userFriendRepository.getOne({
      $or: [
        { user: senderId, friend: receiverId },
        { friend: receiverId, user: senderId },
      ],
    });
    if (isUserFriend) throw new BadRequestException("You are already friends!");

    const isRequestExist = await this.requestRepository.getOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });
    if (isRequestExist) throw new ConflictException("Request already exists!");

    return await this.requestRepository.create({ sender: senderId, receiver: receiverId });
  }

  async acceptRequest(userId: Types.ObjectId, id: Types.ObjectId) {
    const requestExist = await this.requestRepository.getOne({ _id: id });
    if (!requestExist) throw new NotFoundException("Request not found.");

    if (requestExist.receiver.equals(userId))
      throw new UnAuthorizedException("You are not allowed to accept this request.");

    await this.requestRepository.deleteOne({ _id: id });

    await this.userFriendRepository.create({ user: userId, friend: requestExist.sender });
  }

  async declineRequest(userId: Types.ObjectId, id: Types.ObjectId) {
    const requestExist = await this.requestRepository.getOne({ _id: id });
    if (!requestExist) throw new NotFoundException("Request not found.");

    if (!userId.equals(requestExist.sender) && userId.equals(requestExist.receiver))
      throw new UnAuthorizedException("You are not allowed to decline this request.");

    await this.requestRepository.deleteOne({ _id: id });
  }

  async removeFriend(userId: Types.ObjectId, friendId: Types.ObjectId) {
    if (userId.equals(friendId)) throw new UnAuthorizedException("You are not allowed to remove yourself.");

    const userFriendExist = await this.userFriendRepository.getOne({
      $or: [
        { user: userId, friend: friendId },
        { user: friendId, friend: userId },
      ],
    });
    if (!userFriendExist) throw new NotFoundException("You are not friends.");

    await this.userFriendRepository.deleteOne({ _id: userFriendExist._id });
  }
}

export default new RequestService(new RequestRepository(), new UserFriendRepository());
