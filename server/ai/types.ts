import type { Locale } from "@shared/enums";

export interface EventCopyInput {
  sport: string;
  competition?: string | null;
  homeTeam?: string | null;
  awayTeam?: string | null;
  startsAt: Date;
}
export interface EventCopyResult {
  title: string;
  description: string;
  translations: Partial<Record<Locale, { title: string; description: string }>>;
}

export interface LeadLike {
  firstName?: string | null;
  lastName?: string | null;
  message?: string | null;
  source?: string | null;
  partySize?: number | null;
}

/**
 * Neutral AI capability surface. Implementations are selected by AI_PROVIDER.
 * The `noop` provider returns NotImplemented-style signals so the admin UI can
 * render disabled affordances without breaking. Swap to `anthropic` later.
 */
export interface AIProvider {
  readonly enabled: boolean;
  generateEventCopy(input: EventCopyInput): Promise<EventCopyResult>;
  draftLeadReply(lead: LeadLike, context?: string): Promise<string>;
  summarizeLead(lead: LeadLike, notes: string[]): Promise<string>;
  translate(text: string, targetLangs: Locale[]): Promise<Record<string, string>>;
  scoreLead(lead: LeadLike): Promise<number>;
}

export class AINotImplementedError extends Error {
  constructor(capability: string) {
    super(`AI capability "${capability}" is not enabled (AI_PROVIDER=noop)`);
    this.name = "AINotImplementedError";
  }
}
