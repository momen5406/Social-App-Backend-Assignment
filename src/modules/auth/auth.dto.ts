import z from "zod";
import { signupSchema } from "./auth.validation";

export type SignupDTO = z.infer<typeof signupSchema>;

export interface VerifyAccountDTO {
  email: string;
  otp: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}
