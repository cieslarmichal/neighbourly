import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface ExecutePayload {
  readonly email: string;
}

export type SendVerificationEmailCommandHandler = CommandHandler<ExecutePayload, void>;
