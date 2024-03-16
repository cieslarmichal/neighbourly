import { type UserGroupRole } from '@common/contracts';

import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type UserGroup } from '../../../domain/entities/userGroup/userGroup.js';

export interface UpdateUserGroupPayload {
  readonly userId: string;
  readonly groupId: string;
  readonly role: UserGroupRole;
}

export interface UpdateUserGroupResult {
  readonly userGroup: UserGroup;
}

export type UpdateUserGroupCommandHandler = CommandHandler<UpdateUserGroupPayload, UpdateUserGroupResult>;
