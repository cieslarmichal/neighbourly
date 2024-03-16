import {
  type DeleteUserGroupCommandHandler,
  type DeleteUserGroupCommandHandlerPayload,
} from './deleteUserGroupCommandHandler.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type UserGroupRepository } from '../../../domain/repositories/userGroupRepository/userGroupRepository.js';

export class DeleteUserGroupCommandHandlerImpl implements DeleteUserGroupCommandHandler {
  public constructor(
    private readonly userGroupRepository: UserGroupRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: DeleteUserGroupCommandHandlerPayload): Promise<void> {
    const { groupId, userId } = payload;

    this.loggerService.debug({
      message: 'Deleting userGroup...',
      groupId,
      userId,
    });

    await this.userGroupRepository.deleteUserGroup({
      groupId,
      userId,
    });

    this.loggerService.debug({
      message: 'UserGroup deleted.',
      groupId,
      userId,
    });
  }
}
