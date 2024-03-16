import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface ExecutePayload {
  readonly newPassword: string;
  readonly resetPasswordToken: string;
}

export type ChangeUserPasswordCommandHandler = CommandHandler<ExecutePayload, void>;
