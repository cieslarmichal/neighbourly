import { type Group } from './group.js';

export interface SearchGroupQueryParams {
  readonly latitude: number;
  readonly longitude: number;
  readonly radius: number;
}

export type SearchGroupResponse = {
  data: Group[];
};
