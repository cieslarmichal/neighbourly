import { type EmailEvent } from '../../entities/emailEvent/emailEvent.js';
import { type EmailEventDraft } from '../../entities/emailEvent/emailEventDraft.ts/emailEventDraft.js';

export interface FindAllCreatedAfterPayload {
  readonly after: Date;
}

export interface UpdateStatusPayload {
  readonly id: string;
  readonly status: string;
}

export interface EmailEventRepository {
  findAllCreatedAfter(payload: FindAllCreatedAfterPayload): Promise<EmailEvent[]>;
  findAllPending(): Promise<EmailEvent[]>;
  updateStatus(payload: UpdateStatusPayload): Promise<void>;
  deleteProcessed(): Promise<void>;
  create(entity: EmailEventDraft): Promise<void>;
}
