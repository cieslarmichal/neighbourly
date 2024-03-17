import { type QueryHandler } from '../../../../../common/types/queryHandler.js';
import { type GroupAccessRequest } from '../../../domain/entities/groupAccessRequest/groupAccessRequest.js';

export interface FindGroupAccessRequestsPayload {
  readonly groupId: string;
}

export interface FindGroupAccessRequestsResult {
  readonly groupAccessRequests: GroupAccessRequest[];
}

export type FindGroupAccessRequestsQueryHandler = QueryHandler<
  FindGroupAccessRequestsPayload,
  FindGroupAccessRequestsResult
>;
