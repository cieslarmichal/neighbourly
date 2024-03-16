import { type QueryHandler } from '../../../../../common/types/queryHandler.js';
import { type EmailEvent } from '../../../domain/entities/emailEvent/emailEvent.js';

export interface FindEmailEventsResult {
  emailEvents: EmailEvent[];
}

export type FindEmailEventsQueryHandler = QueryHandler<void, FindEmailEventsResult>;
