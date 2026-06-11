import type { recipientStatus } from "@shared/enums";

export type RecipientStatus = (typeof recipientStatus.enumValues)[number];

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
  /** Used to correlate provider webhook events back to a recipient row. */
  tags?: Record<string, string>;
}

export interface NormalizedEvent {
  providerMessageId?: string;
  /** Our unsubscribe token, if the provider echoes it back via tags/headers. */
  recipientToken?: string;
  status: RecipientStatus;
  at: Date;
}

export interface EmailProvider {
  readonly name: string;
  readonly enabled: boolean;
  send(msg: EmailMessage): Promise<{ id: string }>;
  /** Verify + parse a provider webhook into normalized recipient events. */
  parseWebhook(rawBody: Buffer, headers: Record<string, string | undefined>): NormalizedEvent[];
}
