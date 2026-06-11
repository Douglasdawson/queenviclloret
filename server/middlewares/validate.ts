import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny, z } from "zod";

type Source = "body" | "query" | "params";

/** Validate a request part against a Zod schema, replacing it with parsed data. */
export function validate<S extends ZodTypeAny>(schema: S, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) return next(result.error);
    // Express 5 makes req.query a getter-only property, so reassignment throws.
    // Redefine the property with the parsed/coerced data instead.
    Object.defineProperty(req, source, {
      value: result.data as z.infer<S>,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    next();
  };
}
