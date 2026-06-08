import type { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../common";
import { JwtPayload, verify } from "jsonwebtoken";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const user = { username: "hello", email: "e" } as unknown as Request["user"];
  req.user = user;
  next();
};

export const isAuthGQL = (context: any) => {
  const authorization = context.headers.authorization;
  const token = authorization?.split(" ")[1];
  if (!token) throw new BadRequestException("Token is required");
  context.payload = verify(token, "dfagjkdsfbhlgkjadshfkf") as JwtPayload;
  return;
};
