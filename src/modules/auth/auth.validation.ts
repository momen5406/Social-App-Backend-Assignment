import z from "zod";
import { generalFields } from "../../common";

export const signupSchema = z
  .object({
    email: generalFields.email,
    password: generalFields.password,
    username: generalFields.username,
    gender: generalFields.gender,
    phone: generalFields.phone,
  })
  .strict();

export const loginSchema = {};

export const forgetPasswordSchema = {};
