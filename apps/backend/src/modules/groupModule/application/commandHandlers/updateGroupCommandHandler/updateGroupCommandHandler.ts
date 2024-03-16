import { type AccessType } from '@common/contracts';

import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type Group } from '../../../domain/entities/group/group.js';

export interface UpdateGroupPayload {
  readonly id: string;
  readonly name?: string | undefined;
  readonly accessType?: AccessType | undefined;
}

export interface UpdateGroupResult {
  readonly group: Group;
}

export type UpdateGroupCommandHandler = CommandHandler<UpdateGroupPayload, UpdateGroupResult>;
