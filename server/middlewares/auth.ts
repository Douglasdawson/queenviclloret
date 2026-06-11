import type { NextFunction, Request, Response } from "express";
import { AppError } from "./error-handler";
import type { UserRole } from "@shared/enums";

const ROLE_RANK: Record<UserRole, number> = { staff: 1, manager: 2, admin: 3, owner: 4 };

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return next(new AppError(401, "unauthorized", "Authentication required"));
  }
  next();
}

/** Require the session role to be at least `min`. */
export function requireRole(min: UserRole) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.session?.role as UserRole | undefined;
    if (!role) return next(new AppError(401, "unauthorized", "Authentication required"));
    if (ROLE_RANK[role] < ROLE_RANK[min]) {
      return next(new AppError(403, "forbidden", "Insufficient permissions"));
    }
    next();
  };
}
