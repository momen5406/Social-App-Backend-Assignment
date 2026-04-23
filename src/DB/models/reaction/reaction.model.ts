import { model, Schema } from "mongoose";
import { IReaction, ON_MODEL, SYS_REACTIONS } from "../../../common";

const schema = new Schema<IReaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refId: { type: Schema.Types.ObjectId, refPath: "onModel", required: true },
    onModel: { type: String, required: true, enum: ON_MODEL },
    reaction: { type: Number, enum: SYS_REACTIONS, default: SYS_REACTIONS.like },
  },
  { timestamps: true }
);

export const Reaction = model("Reaction", schema);
