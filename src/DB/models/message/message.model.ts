import { model, Schema } from "mongoose";
import { IMessage } from "../../../common/interface/message.interface";

const schema = new Schema<IMessage>(
  {
    content: String,
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
  },
  { timestamps: true }
);

export const Message = model("message", schema);
