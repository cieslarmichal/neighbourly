import { type Group } from './group.js';

export interface CreateGroupRequestBody {
  readonly name: string;
  readonly addressId: string;
}

export type CreateGroupResponseBody = Group;
