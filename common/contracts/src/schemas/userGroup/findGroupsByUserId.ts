import { type Group } from '../group/group.js';

export interface FindGroupsByUserIdPathParams {
  readonly userId: string;
}

export interface FindGroupsByUserIdResponseBody {
  readonly data: Group[];
}
