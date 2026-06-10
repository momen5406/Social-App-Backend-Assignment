import { model, Schema, Types } from "mongoose";
import { IChat } from "../../../common/interface/chat.interface";
import { ChatType } from "../../../common/types/chat.type";

const schema = new Schema<IChat>(
  {
    participants: { type: [Schema.Types.ObjectId], ref: "User", required: true },
    chatType: { type: String, enum: ChatType, default: ChatType.private },
    admin: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: function (this) {
        return this.chatType == ChatType.group;
      },
    },
    groupImg: String,
    groupName: { type: String, required: true },
    groupId: { type: Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export const chat = model("Chat", schema);
