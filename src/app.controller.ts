import express, { NextFunction, Request, Response } from "express";
import { authRouter, commentRouter, postRouter, requestRouter, userRouter } from "./modules";
import { BadRequestException, NotFoundException } from "./common";
import { connectDB } from "./DB/connection";
import { redisConnect } from "./DB/redis.connect";
import { s3CloudProvider } from "./common/cloud/s3/init";
import { promisify } from "node:util";
import { pipeline } from "node:stream";
import { createHandler } from "graphql-http";
import { GraphQLError, GraphQLObjectType, GraphQLSchema } from "graphql";
import { UserGqlQuery } from "./modules/user/graphql/user.query.gql";
import { PostGqlQuery } from "./modules/post/graphql/post.query.gql";
import { CommentGqlQuery } from "./modules/comment/graphql/comment.query.gql";
import { PostGqlMutation } from "./modules/post/graphql/post.mutation.gql";

const pipelinePromise = promisify(pipeline);

export function bootstrap() {
  const app = express();
  const port = 3000;

  app.use("/uploads/*path", async (req: Request, res: Response, next: NextFunction) => {
    let key = (req.params.paths as string[]).join();
    const fileReadStream = await s3CloudProvider.getFile(key);
    if (!fileReadStream) throw new NotFoundException("File not found!");
    await pipelinePromise(fileReadStream, res);
  });

  connectDB();
  redisConnect();
  app.use(express.json());

  const query = new GraphQLObjectType({
    name: "RootQuery",
    fields: { ...UserGqlQuery, ...PostGqlQuery, ...CommentGqlQuery },
  });
  const mutation = new GraphQLObjectType({
    name: "RootMutation",
    fields: { ...PostGqlMutation },
  });
  const schema = new GraphQLSchema({ query, mutation });
  app.all(
    "/graphql",
    createHandler({
      context: (req) => {
        const headers = req.headers;
        return { x: 1, headers };
      },
      schema,
      formatError: (error) => {
        return {
          message: error.message,
          success: false,
          statusCode: error.cause,
        } as unknown as GraphQLError;
      },
    })
  );

  app.use("/auth", authRouter);
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);
  app.use("/request", requestRouter);
  app.use("/user", userRouter);

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
