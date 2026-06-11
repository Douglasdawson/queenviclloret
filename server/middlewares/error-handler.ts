import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";
import { isProd } from "../env";

/** Domain error with an HTTP status + machine code. */
export class AppError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const notFound = (_req: Request, res: Response) => {
  res.status(404).json({ error: { code: "not_found", message: "Resource not found" } });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: { code: "validation_error", message: "Invalid input", details: err.flatten() },
    });
  }
  if (err instanceof AppError) {
    if (err.status >= 500) logger.error({ err, path: req.path }, err.message);
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }
  logger.error({ err, path: req.path }, "unhandled error");
  res.status(500).json({
    error: {
      code: "internal_error",
      message: isProd ? "Internal server error" : String((err as Error)?.message ?? err),
    },
  });
}
