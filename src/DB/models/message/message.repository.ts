import { IMessage } from "../../../common/interface/message.interface";
import { AbstractRepository } from "../../abstract.repository";
import { Message } from "./message.model";

export class MessageRepository extends AbstractRepository<IMessage> {
  constructor() {
    super(Message);
  }
}

export const messageRepository = new MessageRepository();
