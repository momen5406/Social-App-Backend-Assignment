import { model, Schema } from "mongoose";
import { SYS_GENDER, SYS_PROVIDER, SYS_ROLE, UserDocument } from "../../../common";

const schema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, minLength: 2, maxLength: 20 },
    email: { type: String, required: true },
    password: {
      type: String,
      required: function () {
        if (this.provider == SYS_PROVIDER.google) return false;
        return true;
      },
    },
    phone: { type: String },
    role: { type: Number, enum: SYS_ROLE, default: SYS_ROLE.user },
    provider: { type: Number, enum: SYS_PROVIDER, default: SYS_PROVIDER.system },
    gender: { type: Number, enum: SYS_GENDER, default: SYS_GENDER.male },
    profilePic: { type: String },
  },
  { timestamps: true }
);

export const User = model("User", schema);
