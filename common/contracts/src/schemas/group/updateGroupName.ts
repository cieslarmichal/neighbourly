import { type Group } from './group.js';

export interface UpdateGroupNamePathParams {
  readonly id: string;
}

export interface UpdateGroupNameRequestBody {
  readonly name: string;
}

export type UpdateGroupNameResponseBody = Group;
