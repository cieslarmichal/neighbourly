import {
  type RequestGroupAccessCommandHandler,
  type RequestGroupAccessPayload,
  type RequestGroupAccessResult,
} from './requestGroupAccessRequestCommandHandler.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type UserRepository } from '../../../../userModule/domain/repositories/userRepository/userRepository.js';
import { type GroupAccessRequestRepository } from '../../../domain/repositories/groupAccessRequestRepository/groupAccessRequestRepository.js';
import { type GroupRepository } from '../../../domain/repositories/groupRepository/groupRepository.js';

export class RequestGroupAccessCommandHandlerImpl implements RequestGroupAccessCommandHandler {
  public constructor(
    private readonly groupAccessRequestRepository: GroupAccessRequestRepository,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: RequestGroupAccessPayload): Promise<RequestGroupAccessResult> {
    const { userId, groupId } = payload;

    this.loggerService.debug({
      message: 'Requesting group access...',
      userId,
      groupId,
    });

    const user = await this.userRepository.findUser({ id: userId });

    if (!user) {
      throw new OperationNotValidError({
        reason: 'User not found.',
        id: userId,
      });
    }

    const group = await this.groupRepository.findGroup({ id: groupId });

    if (!group) {
      throw new OperationNotValidError({
        reason: 'Group not found.',
        id: groupId,
      });
    }

    const groupAccessRequest = await this.groupAccessRequestRepository.saveGroupAccessRequest({
      groupAccessRequest: {
        groupId,
        userId,
      },
    });

    this.loggerService.debug({
      message: 'Group access requested.',
      id: groupAccessRequest.getId(),
      groupId,
      userId,
    });

    return { groupAccessRequest };
  }
}
