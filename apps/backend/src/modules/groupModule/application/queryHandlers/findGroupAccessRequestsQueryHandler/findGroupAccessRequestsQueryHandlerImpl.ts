import {
  type FindGroupAccessRequestsResult,
  type FindGroupAccessRequestsQueryHandler,
  type FindGroupAccessRequestsPayload,
} from './findGroupAccessRequestsQueryHandler.js';
import { type GroupAccessRequestRepository } from '../../../domain/repositories/groupAccessRequestRepository/groupAccessRequestRepository.js';

export class FindGroupAccessRequestsQueryHandlerImpl implements FindGroupAccessRequestsQueryHandler {
  public constructor(private readonly groupAccessRequestRepository: GroupAccessRequestRepository) {}

  public async execute(payload: FindGroupAccessRequestsPayload): Promise<FindGroupAccessRequestsResult> {
    const { groupId } = payload;

    const groupAccessRequests = await this.groupAccessRequestRepository.findGroupAccessRequests({ groupId });

    return { groupAccessRequests };
  }
}
