import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type GroupAccessRequest } from '../../../domain/entities/groupAccessRequest/groupAccessRequest.js';

export interface RequestGroupAccessPayload {
  readonly userId: string;
  readonly groupId: string;
}

export interface RequestGroupAccessResult {
  readonly groupAccessRequest: GroupAccessRequest;
}

export type RequestGroupAccessCommandHandler = CommandHandler<RequestGroupAccessPayload, RequestGroupAccessResult>;
