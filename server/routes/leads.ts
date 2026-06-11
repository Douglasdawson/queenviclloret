import { Router } from "express";
import { validate } from "../middlewares/validate";
import { requireRole } from "../middlewares/auth";
import { AppError } from "../middlewares/error-handler";
import {
  addNoteSchema,
  listLeadsQuerySchema,
  updateLeadSchema,
  updateLeadStatusSchema,
} from "@shared/validation/leads";
import * as leadsDao from "../dao/leads.dao";
import { ai, AINotImplementedError } from "../ai";

export const leadsRouter: Router = Router();

leadsRouter.use(requireRole("staff"));

leadsRouter.get("/", validate(listLeadsQuerySchema, "query"), async (req, res) => {
  res.json(await leadsDao.listLeads(req.query as never));
});

leadsRouter.get("/:id", async (req, res) => {
  const lead = await leadsDao.getLead((req.params.id as string));
  if (!lead) throw new AppError(404, "not_found", "Lead not found");
  const [tags, notes] = await Promise.all([
    leadsDao.listLeadTags(lead.id),
    leadsDao.listLeadNotes(lead.id),
  ]);
  res.json({ lead, tags, notes });
});

leadsRouter.patch("/:id", validate(updateLeadSchema), async (req, res) => {
  const lead = await leadsDao.updateLead((req.params.id as string), req.body, req.audit);
  if (!lead) throw new AppError(404, "not_found", "Lead not found");
  res.json({ lead });
});

leadsRouter.patch("/:id/status", validate(updateLeadStatusSchema), async (req, res) => {
  const lead = await leadsDao.setLeadStatus((req.params.id as string), req.body.status, req.audit);
  if (!lead) throw new AppError(404, "not_found", "Lead not found");
  res.json({ lead });
});

leadsRouter.delete("/:id", requireRole("admin"), async (req, res) => {
  const ok = await leadsDao.removeLead((req.params.id as string), req.audit);
  if (!ok) throw new AppError(404, "not_found", "Lead not found");
  res.json({ ok });
});

leadsRouter.post("/:id/tags/:tagId", async (req, res) => {
  await leadsDao.addLeadTag((req.params.id as string), (req.params.tagId as string), req.audit.actorId);
  res.json({ ok: true });
});

leadsRouter.delete("/:id/tags/:tagId", async (req, res) => {
  await leadsDao.removeLeadTag((req.params.id as string), (req.params.tagId as string));
  res.json({ ok: true });
});

leadsRouter.post("/:id/notes", validate(addNoteSchema), async (req, res) => {
  const note = await leadsDao.addLeadNote(
    (req.params.id as string),
    req.body.body,
    req.body.pinned ?? false,
    req.audit,
  );
  res.json({ note });
});

/** AI placeholder — wired to the provider (noop today). Returns 501 until enabled. */
leadsRouter.post("/:id/summary", requireRole("manager"), async (req, res) => {
  const lead = await leadsDao.getLead((req.params.id as string));
  if (!lead) throw new AppError(404, "not_found", "Lead not found");
  try {
    const notes = await leadsDao.listLeadNotes(lead.id);
    const summary = await ai.summarizeLead(lead, notes.map((n) => n.body));
    res.json({ summary });
  } catch (err) {
    if (err instanceof AINotImplementedError) {
      throw new AppError(501, "ai_disabled", "AI features are not enabled yet");
    }
    throw err;
  }
});
