import z from "zod";
import { SYS_GENDER } from "../enums";

export const generalFields = {
  email: z.email({ message: "Email is required." }),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  username: z.string().min(2).max(20),
  gender: z.enum(SYS_GENDER, { message: "Gender is inValid." }).optional(),
  phone: z.string().regex(/^(00201|\+201|01)[0-25]{1}[0-9]{8}$/),
};
