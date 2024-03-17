import { type AccessType } from './accessType.js';
import { type Group } from './group.js';

export interface UpdateGroupPathParams {
  readonly groupId: string;
}

export interface UpdateGroupRequestBody {
  readonly name?: string;
  readonly accessType?: AccessType;
}

export type UpdateGroupResponseBody = Group;
