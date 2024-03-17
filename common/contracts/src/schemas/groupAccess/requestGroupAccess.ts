import { type GroupAccessRequest } from './groupAccessRequest.js';

export interface RequestGroupAccessPathParams {
  readonly groupId: string;
}

export type RequestGroupAccessResponseBody = GroupAccessRequest;
