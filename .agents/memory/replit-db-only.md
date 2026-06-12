---
name: Replit built-in DB only
description: User preference and schema setup for this project's database.
---

**Rule:** Always use Replit's built-in PostgreSQL (`DATABASE_URL` secret). Never suggest or configure Neon, Supabase, or any external database.

**Schema:** Applied manually via `executeSql()` from `drizzle/0000_cultured_dark_beast.sql`. Tables: `users`, `leads`, `events`, `reservations`, `campaigns`, `campaign_recipients`, `capacity_slots`, `lead_tags`, `notes`, `tags`, `audit_log`.

**Why:** `drizzle-kit` is blocked by Replit's Socket Security policy — cannot run `drizzle-kit push`. Schema must be applied directly via the database skill's `executeSql()`.

**How to apply:** For future schema migrations, generate the SQL with `drizzle-kit generate` (works locally), then apply via `executeSql()` in the database skill.
