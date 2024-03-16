import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface ExecutePayload {
  readonly emailVerificationToken: string;
}

export type VerifyUserEmailCommandHandler = CommandHandler<ExecutePayload, void>;
