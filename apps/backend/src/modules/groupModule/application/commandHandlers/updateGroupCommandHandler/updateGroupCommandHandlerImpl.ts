import {
  type UpdateGroupCommandHandler,
  type UpdateGroupPayload,
  type UpdateGroupResult,
} from './updateGroupCommandHandler.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type GroupRepository } from '../../../domain/repositories/groupRepository/groupRepository.js';

export class UpdateGroupCommandHandlerImpl implements UpdateGroupCommandHandler {
  public constructor(
    private readonly groupRepository: GroupRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: UpdateGroupPayload): Promise<UpdateGroupResult> {
    const { id, name, accessType } = payload;

    this.loggerService.debug({
      message: 'Updating Group...',
      id,
      name,
      accessType,
    });

    const existingGroup = await this.groupRepository.findGroup({ id });

    if (!existingGroup) {
      throw new ResourceNotFoundError({
        name: 'Group',
        id,
      });
    }

    if (name) {
      const normalizedName = name.toLowerCase();

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
    }

    if (accessType) {
      existingGroup.setAccessType({ accessType });
    }

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
