import { type EmailEventDraft } from '../../../domain/entities/emailEvent/emailEventDraft.ts/emailEventDraft.js';

export interface EmailMessageBus {
  sendEvent(emailEvent: EmailEventDraft): Promise<void>;
}
