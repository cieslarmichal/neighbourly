import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type EmailEventStatus } from '../../../domain/entities/emailEvent/types/emailEventStatus.js';

export interface ChangeEmailEventStatusPayload {
  id: string;
  status: EmailEventStatus;
}

export type ChangeEmailEventStatusCommandHandler = CommandHandler<ChangeEmailEventStatusPayload, void>;
