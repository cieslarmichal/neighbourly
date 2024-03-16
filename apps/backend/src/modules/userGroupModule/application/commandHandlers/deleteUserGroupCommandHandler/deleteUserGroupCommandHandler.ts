import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface DeleteUserGroupCommandHandlerPayload {
  readonly userId: string;
  readonly groupId: string;
}

export type DeleteUserGroupCommandHandler = CommandHandler<DeleteUserGroupCommandHandlerPayload, void>;
