import { NextFunction, Request, Response, Router } from "express";
import { multerUploadFile } from "../../common";
import userService from "./user.service";
import { Types } from "mongoose";
import { isAuthenticated } from "../../middleware";

const router = Router();

router.post(
  "/profile-pic",
  multerUploadFile().single("profile-pic"),
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await userService.uploadProfilePic(
      req.file as Express.Multer.File,
      new Types.ObjectId("69ea1d0391a581efbc2436b0")
    );
    return res.status(200).json({ message: "Success", data });
  }
);

router.get("/", isAuthenticated, async (req: Request, res: Response, next: NextFunction) => {
  const { user, friends } = await userService.profile(new Types.ObjectId(req.user.sub));
  return res.status(200).json({ message: "Success", data: { user, friends } });
});

export default router;
