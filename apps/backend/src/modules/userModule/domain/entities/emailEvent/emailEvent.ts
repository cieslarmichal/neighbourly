import { type BaseEmailPayload } from './types/baseEmailPayload.js';
import { type EmailEventStatus } from './types/emailEventStatus.js';
import { type EmailEventType } from './types/emailEventType.js';

export interface EmailEventState {
  id: string;
  status: EmailEventStatus;
  eventName: EmailEventType;
  payload: BaseEmailPayload;
  createdAt: Date;
}

export class EmailEvent {
  private id: string;

  private status: EmailEventStatus;

  private payload: BaseEmailPayload;

  private createdAt: Date;

  private eventName: EmailEventType;

  public constructor(draft: EmailEventState) {
    const { id, status, payload, createdAt, eventName } = draft;

    this.id = id;

    this.status = status;

    this.payload = payload;

    this.createdAt = createdAt;

    this.eventName = eventName;
  }

  public getId(): string {
    return this.id;
  }

  public getStatus(): EmailEventStatus {
    return this.status;
  }

  public getPayload(): BaseEmailPayload {
    return this.payload;
  }

  public getEmailEventName(): EmailEventType {
    return this.eventName;
  }

  public getRecipientEmail(): string {
    return this.payload.recipientEmail;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
