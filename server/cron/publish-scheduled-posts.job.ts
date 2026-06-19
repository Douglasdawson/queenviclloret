import { logger } from "../lib/logger";
import * as postsDao from "../dao/posts.dao";

const SYSTEM_CTX = { actorId: null, ip: null, userAgent: null };

/** Publish draft posts whose scheduled time has arrived. */
export async function runPublishScheduledPosts(): Promise<void> {
  const due = await postsDao.listDueScheduledPosts(new Date());
  for (const p of due) {
    try {
      await postsDao.setPostStatus(p.id, "published", SYSTEM_CTX);
    } catch (err) {
      logger.error({ post: p.id, err }, "scheduled post publish failed");
    }
  }
  if (due.length) logger.info({ count: due.length }, "scheduled posts published");
}
