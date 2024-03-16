import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type Group } from '../../../domain/entities/group/group.js';

export interface UpdateGroupNamePayload {
  readonly id: string;
  readonly name: string;
}

export interface UpdateGroupNameResult {
  group: Group;
}

export type UpdateGroupNameCommandHandler = CommandHandler<UpdateGroupNamePayload, UpdateGroupNameResult>;
