import { Types } from "mongoose";
import { SYS_REACTIONS } from "../enums";

export interface AddReactionDTO {
  id: Types.ObjectId;
  reaction: SYS_REACTIONS;
}
