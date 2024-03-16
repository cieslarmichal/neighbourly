import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type User } from '../../../domain/entities/user/user.js';

export interface RegisterUserCommandHandlerPayload {
  readonly email: string;
  readonly password: string;
  readonly name: string;
}

export interface RegisterUserCommandHandlerResult {
  readonly user: User;
}

export type RegisterUserCommandHandler = CommandHandler<
  RegisterUserCommandHandlerPayload,
  RegisterUserCommandHandlerResult
>;
