import {
  type ChangeEmailEventStatusCommandHandler,
  type ChangeEmailEventStatusPayload,
} from './changeEmailEventStatusCommandHandler.js';
import { type EmailEventRepository } from '../../../domain/repositories/emailEventRepository/emailEventRepository.js';

export class ChangeEmailEventStatusCommandHandlerImpl implements ChangeEmailEventStatusCommandHandler {
  public constructor(private readonly emailEventRepository: EmailEventRepository) {}

  public async execute(payload: ChangeEmailEventStatusPayload): Promise<void> {
    const { id, status } = payload;

    await this.emailEventRepository.updateStatus({
      id,
      status,
    });
  }
}
