import { type Group } from './group.js';

export interface FindGroupByIdPathParams {
  readonly id: string;
}

export type FindGroupByIdResponseBody = Group;
