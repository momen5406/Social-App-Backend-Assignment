import { Types } from "mongoose";
import { chatRepository, ChatRepository } from "./../../DB/models/chat/chat.repository";
import { NotFoundException } from "../../common";
import { messageRepository, MessageRepository } from "../../DB/models/message/message.repository";

class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository
  ) {}

  async getChat(userId: Types.ObjectId, loggedUserId: Types.ObjectId) {
    const chat = await this.chatRepository.getOne({ participants: { $all: [userId, loggedUserId] } });
    if (!chat) throw new NotFoundException("Chat not Found");

    const messages = await this.getMessages(userId, loggedUserId, chat._id);
    console.log(chat, messages);

    return { chat, messages };
  }

  private async getMessages(userId: Types.ObjectId, loggedUserId: Types.ObjectId, chatId: Types.ObjectId) {
    const messages = await this.messageRepository.getAll(
      { $or: [{ sender: userId }, { sender: loggedUserId }], chat: chatId },
      {},
      { limit: 10, sort: { createdAt: -1 } }
    );
    return messages;
  }
}

export default new ChatService(chatRepository, messageRepository);
