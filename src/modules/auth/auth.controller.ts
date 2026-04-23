import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import authService from "./auth.service";
import { isValid } from "../../middleware";
import { signupSchema } from "./auth.validation";
import { success } from "zod";

const router = Router();

router.post("/signup", isValid(signupSchema), async (req: Request, res: Response, next: NextFunction) => {
  const createdUser = authService.signup(req.body);
  return res.status(201).json({ message: "User Created Successfully.", success: true });
});

router.post("/verify-account", async (req: Request, res: Response, next: NextFunction) => {
  await authService.verifyAccount(req.body);
  return res.status(200).json({ message: "User Verified Successfully.", success: true });
});

router.post("/resend-otp", async (req: Request, res: Response, next: NextFunction) => {
  await authService.resendOTP(req.body);
  return res.status(200).json({ message: "Resend OTP Successfully.", success: true });
});

router.patch("/reset-password", async (req: Request, res: Response, next: NextFunction) => {
  await authService.resetPassword(req.body);
  return res.status(200).json({ message: "Reset Password Successfully.", success: true });
});

export default router;
