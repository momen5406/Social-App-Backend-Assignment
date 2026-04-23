import { NextFunction, Request, Response, Router } from "express";
import { Types } from "mongoose";
import { success } from "zod";
import { isValid } from "../../middleware";
import commentService from "./comment.service";
import { addReaction } from "../../common";
import { commentRepository } from "../../DB/models/comment/comment.repository";

const router = Router();

router.post("/reaction", async (req: Request, res: Response, next: NextFunction) => {
  await addReaction(req.body, new Types.ObjectId("69ea1d0391a581efbc2436b0"), commentRepository);
  res.sendStatus(204);
});

router.post("/:postId{/:parentId}", async (req: Request, res: Response, next: NextFunction) => {
  await commentService.create(req.body, req.params, new Types.ObjectId("69ea1d0391a581efbc2436b0"));
  res.sendStatus(204);
});

router.get("/:postId{/:parentId}", async (req: Request, res: Response, next: NextFunction) => {
  const comments = await commentService.getAll(req.params);
  res.status(200).json({ success: true, data: comments });
});

export default router;
