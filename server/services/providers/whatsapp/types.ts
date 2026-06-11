import type { recipientStatus } from "@shared/enums";

export type RecipientStatus = (typeof recipientStatus.enumValues)[number];

export interface WhatsAppTemplate {
  name: string;
  languageCode: string;
  variables?: string[];
}

export interface NormalizedWaEvent {
  providerMessageId?: string;
  status: RecipientStatus;
  at: Date;
}

export interface WhatsAppProvider {
  readonly name: string;
  readonly enabled: boolean;
  /** Marketing/HSM template (required to message outside the 24h session window). */
  sendTemplate(to: string, template: WhatsAppTemplate): Promise<{ id: string }>;
  /** Free-form session message (only valid within the 24h window). */
  sendSession(to: string, text: string): Promise<{ id: string }>;
  parseWebhook(rawBody: Buffer, headers: Record<string, string | undefined>): NormalizedWaEvent[];
}
