import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";
import axios from "axios";

export const ErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      errors: `Validation Error ${JSON.stringify(err)}`,
    });
  } else if (axios.isAxiosError(err)) {
    res.status(err.response?.status || 500).json({
      errors: err.message || "Internal Server Error",
    });
  } else if (err instanceof ResponseError) {
    res.status(err.status).json({
      errors: err.message,
    });
  } else {
    res.status(500).json({
      errors: `Internal Server Error ${err.message}`,
    });
  }
};
