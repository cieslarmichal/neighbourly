import { type AccessType } from '@common/contracts';

import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type Group } from '../../../domain/entities/group/group.js';

export interface CreateGroupPayload {
  readonly name: string;
  readonly accessType: AccessType;
}

export interface CreateGroupResult {
  readonly group: Group;
}

export type CreateGroupCommandHandler = CommandHandler<CreateGroupPayload, CreateGroupResult>;
