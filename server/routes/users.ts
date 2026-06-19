import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { validate } from "../middlewares/validate";
import { requireRole } from "../middlewares/auth";
import { AppError } from "../middlewares/error-handler";
import type { UserRole } from "@shared/enums";
import * as usersDao from "../dao/users.dao";

export const usersRouter: Router = Router();

// User management is owner/admin only.
usersRouter.use(requireRole("admin"));

const roleEnum = z.enum(["owner", "admin", "manager", "staff", "editor"]);

const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  name: z.string().trim().min(1).max(120),
  role: roleEnum.default("editor"),
  password: z.string().min(8).max(200),
});

const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  role: roleEnum.optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).max(200).optional(),
});

usersRouter.get("/", async (_req, res) => {
  const rows = await usersDao.listUsers();
  res.json({ users: rows.map(usersDao.publicUser) });
});

usersRouter.post("/", validate(createUserSchema), async (req, res) => {
  const body = req.body as z.infer<typeof createUserSchema>;
  const existing = await usersDao.findByEmail(body.email);
  if (existing) throw new AppError(409, "email_taken", "A user with that email already exists");
  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await usersDao.createUserAudited(
    { email: body.email, name: body.name, role: body.role, passwordHash },
    req.audit,
  );
  res.status(201).json({ user: usersDao.publicUser(user) });
});

usersRouter.patch("/:id", validate(updateUserSchema), async (req, res) => {
  const body = req.body as z.infer<typeof updateUserSchema>;
  const id = req.params.id as string;
  // Don't let an admin lock themselves out by self-demoting / self-deactivating.
  if (id === req.session.userId && (body.role !== undefined || body.isActive === false)) {
    throw new AppError(400, "self_change_blocked", "You cannot change your own role or status");
  }
  const patch: { name?: string; role?: UserRole; isActive?: boolean; passwordHash?: string } = {
    name: body.name,
    role: body.role,
    isActive: body.isActive,
  };
  if (body.password) patch.passwordHash = await bcrypt.hash(body.password, 12);
  const user = await usersDao.updateUser(id, patch, req.audit);
  if (!user) throw new AppError(404, "not_found", "User not found");
  res.json({ user: usersDao.publicUser(user) });
});

usersRouter.delete("/:id", async (req, res) => {
  const id = req.params.id as string;
  if (id === req.session.userId) {
    throw new AppError(400, "self_delete_blocked", "You cannot delete your own account");
  }
  const ok = await usersDao.removeUser(id, req.audit);
  if (!ok) throw new AppError(404, "not_found", "User not found");
  res.json({ ok });
});
