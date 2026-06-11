import type { NextFunction, Request, Response } from "express";

export interface AuditContext {
  actorId: string | null;
  ip: string | null;
  userAgent: string | null;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      audit: AuditContext;
    }
  }
}

/** Attach actor/ip/ua so DAOs can write audit_log entries. */
export function auditContext(req: Request, _res: Response, next: NextFunction) {
  req.audit = {
    actorId: req.session?.userId ?? null,
    ip: req.ip ?? req.socket.remoteAddress ?? null,
    userAgent: req.get("user-agent") ?? null,
  };
  next();
}
