import { Router } from "express";
import { validate } from "../middlewares/validate";
import { requireRole, requireRoleIn } from "../middlewares/auth";
import { AppError } from "../middlewares/error-handler";
import {
  listPostsQuerySchema,
  upsertPostSchema,
  updatePostSchema,
  upsertPostCategorySchema,
  previewSchema,
} from "@shared/validation/posts";
import * as postsDao from "../dao/posts.dao";
import * as categoriesDao from "../dao/post-categories.dao";
import { renderMarkdown } from "../lib/markdown";

export const postsRouter: Router = Router();

// Authoring roles (editor is blog-only; managers/admins/owner can also author).
postsRouter.use(requireRoleIn(["owner", "admin", "manager", "editor"]));

/* ----------------------------------------------- categories (before /:id) */
postsRouter.get("/categories", async (_req, res) => {
  res.json({ categories: await categoriesDao.listCategories() });
});

postsRouter.post("/categories", validate(upsertPostCategorySchema), async (req, res) => {
  const category = await categoriesDao.createCategory(req.body, req.audit);
  res.status(201).json({ category });
});

postsRouter.patch(
  "/categories/:id",
  validate(upsertPostCategorySchema.partial()),
  async (req, res) => {
    const category = await categoriesDao.updateCategory(req.params.id as string, req.body, req.audit);
    if (!category) throw new AppError(404, "not_found", "Category not found");
    res.json({ category });
  },
);

postsRouter.delete("/categories/:id", requireRole("admin"), async (req, res) => {
  const ok = await categoriesDao.removeCategory(req.params.id as string, req.audit);
  if (!ok) throw new AppError(404, "not_found", "Category not found");
  res.json({ ok });
});

/* ------------------------------------------------------- markdown preview */
postsRouter.post("/preview", validate(previewSchema), (req, res) => {
  res.json({ html: renderMarkdown((req.body as { markdown: string }).markdown) });
});

/* ----------------------------------------------------------------- posts */
postsRouter.get("/", validate(listPostsQuerySchema, "query"), async (req, res) => {
  res.json(await postsDao.listPosts(req.query as never));
});

postsRouter.get("/:id", async (req, res) => {
  const post = await postsDao.getPostById(req.params.id as string);
  if (!post) throw new AppError(404, "not_found", "Post not found");
  res.json({ post });
});

postsRouter.post("/", validate(upsertPostSchema), async (req, res) => {
  const post = await postsDao.createPost(req.body, req.audit);
  res.status(201).json({ post });
});

postsRouter.patch("/:id", validate(updatePostSchema), async (req, res) => {
  const post = await postsDao.updatePost(req.params.id as string, req.body, req.audit);
  if (!post) throw new AppError(404, "not_found", "Post not found");
  res.json({ post });
});

postsRouter.post("/:id/publish", async (req, res) => {
  const post = await postsDao.setPostStatus(req.params.id as string, "published", req.audit);
  if (!post) throw new AppError(404, "not_found", "Post not found");
  res.json({ post });
});

postsRouter.delete("/:id", requireRole("admin"), async (req, res) => {
  const ok = await postsDao.removePost(req.params.id as string, req.audit);
  if (!ok) throw new AppError(404, "not_found", "Post not found");
  res.json({ ok });
});
