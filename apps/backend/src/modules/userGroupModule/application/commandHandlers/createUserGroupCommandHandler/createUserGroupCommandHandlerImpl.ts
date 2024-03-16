import {
  type CreateUserGroupCommandHandler,
  type CreateUserGroupCommandHandlerPayload,
  type CreateUserGroupCommandHandlerResult,
} from './createUserGroupCommandHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type GroupRepository } from '../../../../groupModule/domain/repositories/groupRepository/groupRepository.js';
import { type UserRepository } from '../../../../userModule/domain/repositories/userRepository/userRepository.js';
import { type UserGroupRepository } from '../../../domain/repositories/userGroupRepository/userGroupRepository.js';

export class CreateUserGroupCommandHandlerImpl implements CreateUserGroupCommandHandler {
  public constructor(
    private readonly userGroupRepository: UserGroupRepository,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: CreateUserGroupCommandHandlerPayload): Promise<CreateUserGroupCommandHandlerResult> {
    const { groupId, userId, role } = payload;

    this.loggerService.debug({
      message: 'Creating UserGroup...',
      groupId,
      userId,
      role,
    });

    const user = await this.userRepository.findUser({ id: userId });

    if (!user) {
      throw new ResourceNotFoundError({
        name: 'User',
        id: userId,
      });
    }

    const group = await this.groupRepository.findGroup({ id: groupId });

    if (!group) {
      throw new ResourceNotFoundError({
        name: 'Group',
        id: groupId,
      });
    }

    const userGroup = await this.userGroupRepository.saveUserGroup({
      userGroup: {
        userId,
        groupId,
        role,
      },
    });

    this.loggerService.debug({
      message: 'UserGroup created.',
      userGroupId: userGroup.getId(),
      groupId,
      userId,
      role,
    });

    return { userGroup };
  }
}
