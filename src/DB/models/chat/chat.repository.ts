import { IChat } from "../../../common/interface/chat.interface";
import { AbstractRepository } from "../../abstract.repository";
import { chat } from "./chat.model";

export class ChatRepository extends AbstractRepository<IChat> {
  constructor() {
    super(chat);
  }
}

export const chatRepository = new ChatRepository();
