import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface ExecutePayload {
  readonly userId: string;
  readonly refreshToken: string;
  readonly accessToken: string;
}

export type LogoutUserCommandHandler = CommandHandler<ExecutePayload, void>;
