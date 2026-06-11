import { Router } from "express";
import bcrypt from "bcryptjs";
import { validate } from "../middlewares/validate";
import { requireAuth } from "../middlewares/auth";
import { authLimiter } from "../middlewares/rate-limit";
import { AppError } from "../middlewares/error-handler";
import { loginSchema } from "@shared/validation/auth";
import * as usersDao from "../dao/users.dao";

export const authRouter: Router = Router();

authRouter.post("/login", authLimiter, validate(loginSchema), async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await usersDao.findByEmail(email);

  // constant-ish time: always compare against something
  const hash = user?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidin";
  const ok = await bcrypt.compare(password, hash);

  if (!user || !user.isActive) throw new AppError(401, "invalid_credentials", "Invalid credentials");
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new AppError(429, "account_locked", "Account temporarily locked");
  }
  if (!ok) {
    await usersDao.recordLoginFailure(user.id, user.failedLoginCount);
    throw new AppError(401, "invalid_credentials", "Invalid credentials");
  }

  await usersDao.recordLoginSuccess(user.id);
  req.session.userId = user.id;
  req.session.role = user.role;
  res.json({ user: usersDao.publicUser(user) });
});

authRouter.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("qv.sid");
    res.json({ ok: true });
  });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await usersDao.findById(req.session.userId!);
  if (!user) throw new AppError(401, "unauthorized", "Session invalid");
  res.json({ user: usersDao.publicUser(user) });
});
