import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { BadRequestException } from "../common";

export const isValid = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParse(req.body);
    if (result.success == false) {
      const errorMessages = result.error.issues.map((issue) => ({
        path: issue.path[0] as string,
        message: issue.message,
      }));
      throw new BadRequestException("Validation Error", errorMessages);
    }
    next();
  };
};

export const isValidGQL = async (schema: ZodObject, args: any) => {
  const result = await schema.safeParse(args);
  if (result.success == false) {
    const errorMessages = result.error.issues.map((issue) => ({
      path: issue.path[0] as string,
      message: issue.message,
    }));
    throw new BadRequestException("Validation Error", errorMessages);
  }
};
