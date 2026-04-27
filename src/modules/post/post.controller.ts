import { NextFunction, Request, Response, Router } from "express";
import postService from "./post.service";
import { Types } from "mongoose";
import { isValid } from "../../middleware";
import { createPostSchema } from "./post.dto";
import { addReaction } from "../../common";
import { postRepository } from "../../DB/models/post/post.repository";
import { default as commentRouter } from "../comment/comment.controller";

const router = Router();

router.use("/:postId/comment", commentRouter);

router.post("/", isValid(createPostSchema), async (req: Request, res: Response, next: NextFunction) => {
  const createdPost = await postService.create(req.body, new Types.ObjectId("69ea1d0391a581efbc2436b0"));
  return res.status(201).json({ message: "Post Created Successfully.", success: true, data: { createdPost } });
});

router.post("/reaction", async (req: Request, res: Response, next: NextFunction) => {
  await addReaction(req.body, new Types.ObjectId("69ea1d0391a581efbc2436b0"), postRepository);
  return res.sendStatus(204);
});

export default router;
