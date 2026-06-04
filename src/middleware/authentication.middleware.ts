import type { NextFunction, Request, Response } from "express";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const user = { username: "hello", email: "e" } as unknown as Request["user"];
  req.user = user;
  next();
};
