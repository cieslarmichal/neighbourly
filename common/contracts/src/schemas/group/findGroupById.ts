import { type Group } from './group.js';

export interface FindGroupByIdPathParams {
  readonly groupId: string;
}

export type FindGroupByIdResponseBody = Group;
