import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";

export interface TypedRequest<T extends z.Schema> extends Request {
  body: z.infer<T>;
}

export const validator = <T extends z.ZodType>(schema: T) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(result.error);
      return;
    }

    next();
  };
};
