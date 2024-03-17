import { type GroupAccessRequest } from './groupAccessRequest.js';

export interface FindGroupAccessRequestsPathParams {
  readonly groupId: string;
}

export interface FindGroupAccessRequestsResponseBody {
  readonly data: GroupAccessRequest[];
}
