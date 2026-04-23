import type { NextFunction, Request, Response } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let user = { username: "hello", email: "e" };
  req.user = user;
  next();
};
