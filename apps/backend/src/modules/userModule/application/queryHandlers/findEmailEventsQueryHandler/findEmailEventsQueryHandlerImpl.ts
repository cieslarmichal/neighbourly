import { type FindEmailEventsQueryHandler, type FindEmailEventsResult } from './findEmailEventsQueryHandler.js';
import { type EmailEventRepository } from '../../../domain/repositories/emailEventRepository/emailEventRepository.js';

export class FindEmailEventsQueryHandlerImpl implements FindEmailEventsQueryHandler {
  public constructor(private readonly emailEventRepository: EmailEventRepository) {}

  public async execute(): Promise<FindEmailEventsResult> {
    const emailEvents = await this.emailEventRepository.findAllPending();

    return {
      emailEvents,
    };
  }
}
