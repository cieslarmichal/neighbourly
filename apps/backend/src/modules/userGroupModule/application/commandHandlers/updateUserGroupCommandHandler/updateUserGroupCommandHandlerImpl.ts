import {
  type UpdateUserGroupCommandHandler,
  type UpdateUserGroupPayload,
  type UpdateUserGroupResult,
} from './updateUserGroupCommandHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type UserGroupRepository } from '../../../domain/repositories/userGroupRepository/userGroupRepository.js';

export class UpdateUserGroupCommandHandlerImpl implements UpdateUserGroupCommandHandler {
  public constructor(
    private readonly userGroupRepository: UserGroupRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: UpdateUserGroupPayload): Promise<UpdateUserGroupResult> {
    const { groupId, userId, role } = payload;

    this.loggerService.debug({
      message: 'Updating UserGroup...',
      groupId,
      userId,
      role,
    });

    const userGroup = await this.userGroupRepository.findUserGroup({
      groupId,
      userId,
    });

    if (!userGroup) {
      throw new ResourceNotFoundError({
        name: 'UserGroup',
        groupId,
        userId,
      });
    }

    userGroup.setRole({ role });

    await this.userGroupRepository.saveUserGroup({ userGroup });

    this.loggerService.debug({
      message: 'UserGroup updated.',
      groupId,
      userId,
      role,
    });

    return { userGroup };
  }
}
