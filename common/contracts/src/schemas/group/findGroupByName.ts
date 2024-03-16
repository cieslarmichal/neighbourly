import { type Group } from './group.js';

export interface FindGroupByNameQueryParams {
  readonly name: string;
}

export type FindGroupByNameResponseBody = Group;
