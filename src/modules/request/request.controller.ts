import { NextFunction, Request, Response } from "express";
import { Router } from "express";
import requestService from "./request.service";
import { Types } from "mongoose";

const router = Router();

router.post("/:receiverId", async (req: Request, res: Response, next: NextFunction) => {
  await requestService.sendRequest(
    new Types.ObjectId("69ea1d0391a581efbc2436b0"),
    new Types.ObjectId(req.params.receiverId as string)
  );
  return res.sendStatus(204);
});

router.post("/accept/:id", async (req: Request, res: Response, next: NextFunction) => {
  await requestService.acceptRequest(
    new Types.ObjectId("69ea1d0391a581efbc2436b0"),
    new Types.ObjectId(req.params.id as string)
  );
  return res.sendStatus(204);
});

router.delete("/decline/:id", async (req: Request, res: Response, next: NextFunction) => {
  await requestService.declineRequest(
    new Types.ObjectId("69ea1d0391a581efbc2436b0"),
    new Types.ObjectId(req.params.id as string)
  );
  return res.sendStatus(204);
});

router.delete("/remove/:friendId", async (req: Request, res: Response, next: NextFunction) => {
  await requestService.removeFriend(
    new Types.ObjectId("69ea1d0391a581efbc2436b0"),
    new Types.ObjectId(req.params.friendId as string)
  );
  return res.sendStatus(204);
});

export default router;
