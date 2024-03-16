import { type UserGroupRole } from '@common/contracts';

import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type UserGroup } from '../../../domain/entities/userGroup/userGroup.js';

export interface CreateUserGroupCommandHandlerPayload {
  readonly userId: string;
  readonly groupId: string;
  readonly role: UserGroupRole;
}

export interface CreateUserGroupCommandHandlerResult {
  readonly userGroup: UserGroup;
}

export type CreateUserGroupCommandHandler = CommandHandler<
  CreateUserGroupCommandHandlerPayload,
  CreateUserGroupCommandHandlerResult
>;
