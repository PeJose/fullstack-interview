import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const firstErrorMessage = err.errors[0]?.message || "Validation error";

    return res.status(400).json({ message: firstErrorMessage });
  }

  console.error(err);
  res.status(500).json("Internal Server Error");
};
