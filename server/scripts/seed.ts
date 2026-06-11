import bcrypt from "bcryptjs";
import { env } from "../env";
import { logger } from "../lib/logger";
import { pool } from "../db";
import * as usersDao from "../dao/users.dao";

/** Seed the initial owner account. Idempotent. */
async function main() {
  const email = env.SEED_OWNER_EMAIL;
  const password = env.SEED_OWNER_PASSWORD;
  const name = env.SEED_OWNER_NAME ?? "Owner";

  if (!email || !password) {
    throw new Error("SEED_OWNER_EMAIL and SEED_OWNER_PASSWORD are required to seed.");
  }

  const existing = await usersDao.findByEmail(email);
  if (existing) {
    logger.info({ email }, "owner already exists, skipping");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await usersDao.createUser({ email, passwordHash, name, role: "owner" });
  logger.info({ id: user.id, email }, "✅ owner created");
}

main()
  .then(() => pool.end())
  .then(() => process.exit(0))
  .catch((err) => {
    logger.error({ err }, "seed failed");
    process.exit(1);
  });
