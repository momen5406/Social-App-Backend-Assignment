import { Types } from "mongoose";
import { ON_MODEL, SYS_REACTIONS } from "../enums";

export interface IReaction {
  userId: Types.ObjectId;
  refId: Types.ObjectId;
  onModel: ON_MODEL;
  reaction: SYS_REACTIONS;
}
