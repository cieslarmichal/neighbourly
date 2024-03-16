import { type AccessType } from './accessType.js';
import { type Group } from './group.js';

export interface CreateGroupRequestBody {
  readonly name: string;
  readonly accessType: AccessType;
}

export type CreateGroupResponseBody = Group;
