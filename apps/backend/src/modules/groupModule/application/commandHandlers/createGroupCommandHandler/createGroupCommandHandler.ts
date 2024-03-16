import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type Group } from '../../../domain/entities/group/group.js';

export interface CreateGroupPayload {
  name: string;
}

export interface CreateGroupResult {
  group: Group;
}

export type CreateGroupCommandHandler = CommandHandler<CreateGroupPayload, CreateGroupResult>;
