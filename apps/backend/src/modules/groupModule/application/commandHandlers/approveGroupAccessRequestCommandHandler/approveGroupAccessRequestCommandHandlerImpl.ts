import { UserGroupRole } from '@common/contracts';

import {
  type ApproveGroupAccessRequestCommandHandler,
  type ApproveGroupAccessRequestPayload,
} from './approveGroupAccessRequestCommandHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type UserGroupRepository } from '../../../../userGroupModule/domain/repositories/userGroupRepository/userGroupRepository.js';
import { type GroupAccessRequestRepository } from '../../../domain/repositories/groupAccessRequestRepository/groupAccessRequestRepository.js';

export class ApproveGroupAccessRequestCommandHandlerImpl implements ApproveGroupAccessRequestCommandHandler {
  public constructor(
    private readonly groupAccessRequestRepository: GroupAccessRequestRepository,
    private readonly userGroupRepository: UserGroupRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: ApproveGroupAccessRequestPayload): Promise<void> {
    const { requestId } = payload;

    this.loggerService.debug({
      message: 'Approving GroupAccessRequest...',
      requestId,
    });

    const groupAccessRequest = await this.groupAccessRequestRepository.findGroupAccessRequest({
      id: requestId,
    });

    if (!groupAccessRequest) {
      throw new ResourceNotFoundError({
        name: 'GroupAccessRequest',
        id: requestId,
      });
    }

    await this.groupAccessRequestRepository.deleteGroupAccessRequest({ id: groupAccessRequest.getId() });

    await this.userGroupRepository.saveUserGroup({
      userGroup: {
        groupId: groupAccessRequest.getGroupId(),
        userId: groupAccessRequest.getUserId(),
        role: UserGroupRole.user,
      },
    });

    this.loggerService.debug({
      message: 'GroupAccessRequest approved.',
      requestId,
    });
  }
}
