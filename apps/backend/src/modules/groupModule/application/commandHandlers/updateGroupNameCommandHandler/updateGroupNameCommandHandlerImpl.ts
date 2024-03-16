import {
  type UpdateGroupNameCommandHandler,
  type UpdateGroupNamePayload,
  type UpdateGroupNameResult,
} from './updateGroupNameCommandHandler.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type GroupRepository } from '../../../domain/repositories/groupRepository/groupRepository.js';

export class UpdateGroupNameCommandHandlerImpl implements UpdateGroupNameCommandHandler {
  public constructor(
    private readonly groupRepository: GroupRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: UpdateGroupNamePayload): Promise<UpdateGroupNameResult> {
    const { id, name } = payload;

    const normalizedName = name.toLowerCase();

    this.loggerService.debug({
      message: 'Updating Group name...',
      id,
      name: normalizedName,
    });

    const existingGroup = await this.groupRepository.findGroup({ id });

    if (!existingGroup) {
      throw new ResourceNotFoundError({
        name: 'Group',
        id,
      });
    }

    const nameTaken = await this.groupRepository.findGroup({
      name: normalizedName,
    });

    if (nameTaken) {
      throw new OperationNotValidError({
        reason: 'Group with this name already exists.',
        name,
      });
    }

    existingGroup.setName({ name: normalizedName });

    const group = await this.groupRepository.saveGroup({
      group: existingGroup,
    });

    this.loggerService.debug({
      message: 'Group name updated.',
      id,
      name,
    });

    return {
      group,
    };
  }
}
