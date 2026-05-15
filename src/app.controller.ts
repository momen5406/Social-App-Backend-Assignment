import express, { NextFunction, Request, Response } from "express";
import { authRouter, commentRouter, postRouter, requestRouter } from "./modules";
import { BadRequestException, NotFoundException } from "./common";
import { connectDB } from "./DB/connection";
import { redisConnect } from "./DB/redis.connect";
import { s3CloudProvider } from "./common/cloud/s3/init";
import { promisify } from "node:util";
import { pipeline } from "node:stream";

const pipelinePromise = promisify(pipeline);

export function bootstrap() {
  const app = express();
  const port = 3000;

  app.use("/uploads/:*path", async (req: Request, res: Response, next: NextFunction) => {
    let key = (req.params.paths as string[]).join();
    const fileReadStream = await s3CloudProvider.getFile(key);
    if (!fileReadStream) throw new NotFoundException("File not found!");
    await pipelinePromise(fileReadStream, res);
  });

  connectDB();
  redisConnect();

  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);
  app.use("/request", requestRouter);

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status((error.cause as number) || 500).json({
      message: error.message,
      success: false,
      details: error instanceof BadRequestException ? error.details : undefined,
    });
  });

  app.listen(port, () => {
    console.log("Application is running on port", port);
  });
}
