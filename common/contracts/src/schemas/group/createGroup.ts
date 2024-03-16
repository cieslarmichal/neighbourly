import { type Group } from './group.js';

export interface CreateGroupRequestBody {
  readonly name: string;
}

export type CreateGroupResponseBody = Group;
