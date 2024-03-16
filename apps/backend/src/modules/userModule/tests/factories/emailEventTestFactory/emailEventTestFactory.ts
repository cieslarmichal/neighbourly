import { Generator } from '@common/tests';

import { EmailEvent, type EmailEventState } from '../../../domain/entities/emailEvent/emailEvent.js';
import {
  EmailEventDraft,
  type EmailEventDraftState,
} from '../../../domain/entities/emailEvent/emailEventDraft.ts/emailEventDraft.js';
import { EmailEventStatus } from '../../../domain/entities/emailEvent/types/emailEventStatus.js';
import { EmailEventType } from '../../../domain/entities/emailEvent/types/emailEventType.js';

export class EmailEventTestFactory {
  public createDraft(overrides: Partial<EmailEventDraftState> = {}): EmailEventDraft {
    return new EmailEventDraft({
      payload: {
        recipientEmail: Generator.email(),
        emailEventType: Generator.arrayElement<EmailEventType>(Object.keys(EmailEventType) as EmailEventType[]),
        name: Generator.fullName(),
        ...overrides.payload,
      },
      eventName: Generator.arrayElement<EmailEventType>(Object.keys(EmailEventType) as EmailEventType[]),
    });
  }

  public create(overrides: Partial<EmailEventState> = {}): EmailEvent {
    return new EmailEvent({
      createdAt: Generator.pastDate(),
      id: Generator.uuid(),
      eventName: Generator.arrayElement<EmailEventType>(Object.keys(EmailEventType) as EmailEventType[]),
      status: EmailEventStatus.pending,
      ...overrides,
      payload: {
        recipientEmail: Generator.email(),
        emailEventType: Generator.arrayElement<EmailEventType>(Object.keys(EmailEventType) as EmailEventType[]),
        name: Generator.fullName(),
        ...overrides.payload,
      },
    });
  }
}
