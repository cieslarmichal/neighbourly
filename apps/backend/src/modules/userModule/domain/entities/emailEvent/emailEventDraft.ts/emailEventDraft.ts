import { type BaseEmailPayload } from '../types/baseEmailPayload.js';
import { type EmailEventType } from '../types/emailEventType.js';

export interface EmailEventDraftState {
  payload: BaseEmailPayload;
  eventName: EmailEventType;
}

export class EmailEventDraft {
  private payload: BaseEmailPayload;

  private eventName: EmailEventType;

  public constructor(draft: EmailEventDraftState) {
    const { payload, eventName } = draft;

    this.payload = payload;

    this.eventName = eventName;
  }

  public getPayload(): BaseEmailPayload {
    return this.payload;
  }

  public getEmailEventName(): EmailEventType {
    return this.eventName;
  }
}
