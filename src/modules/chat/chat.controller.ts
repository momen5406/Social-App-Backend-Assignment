import { NextFunction, Request, Response, Router } from "express";
import chatService from "./chat.service";
import { Types } from "mongoose";

const router = Router();

router.get("/:userId", async (req: Request, res: Response, next: NextFunction) => {
  const { chat, messages } = await chatService.getChat(
    new Types.ObjectId(req.params.userId as string),
    new Types.ObjectId(req.user.sub)
  );

  return res.status(200).json({ message: "success", data: { chat, messages } });
});

export default router;
