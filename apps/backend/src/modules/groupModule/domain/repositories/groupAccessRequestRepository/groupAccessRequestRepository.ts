import {
  type GroupAccessRequestState,
  type GroupAccessRequest,
} from '../../entities/groupAccessRequest/groupAccessRequest.js';

export interface FindGroupAccessRequestPayload {
  readonly id: string;
}

export interface SaveGroupAccessRequestPayload {
  readonly groupAccessRequest: GroupAccessRequestState;
}

export interface FindGroupAccessRequests {
  readonly groupId: string;
}

export interface DeleteGroupAccessRequestPayload {
  readonly id: string;
}

export interface GroupAccessRequestRepository {
  findGroupAccessRequest(payload: FindGroupAccessRequestPayload): Promise<GroupAccessRequest | null>;
  findGroupAccessRequests(payload: FindGroupAccessRequests): Promise<GroupAccessRequest[]>;
  saveGroupAccessRequest(payload: SaveGroupAccessRequestPayload): Promise<GroupAccessRequest>;
  deleteGroupAccessRequest(payload: DeleteGroupAccessRequestPayload): Promise<void>;
}
