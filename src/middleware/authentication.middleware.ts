import type { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../common";
import { JwtPayload, verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization) throw new BadRequestException("Token is required");
  const token = authorization?.split(" ")[1];
  if (!token) throw new BadRequestException("Token is required");
  req.user = verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
  next();
};

export const isAuthGQL = (context: any) => {
  const authorization = context.headers.authorization;
  const token = authorization?.split(" ")[1];
  if (!token) throw new BadRequestException("Token is required");
  context.payload = verify(token, "dfagjkdsfbhlgkjadshfkf") as JwtPayload;
  return;
};
