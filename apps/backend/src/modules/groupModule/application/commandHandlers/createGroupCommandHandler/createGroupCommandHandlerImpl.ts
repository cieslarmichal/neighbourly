import {
  type CreateGroupCommandHandler,
  type CreateGroupPayload,
  type CreateGroupResult,
} from './createGroupCommandHandler.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type GroupRepository } from '../../../domain/repositories/groupRepository/groupRepository.js';

export class CreateGroupCommandHandlerImpl implements CreateGroupCommandHandler {
  public constructor(
    private readonly groupRepository: GroupRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: CreateGroupPayload): Promise<CreateGroupResult> {
    const { name } = payload;

    const normalizedName = name.toLowerCase();

    this.loggerService.debug({
      message: 'Creating Group...',
      name,
    });

    const groupExists = await this.groupRepository.findGroup({
      name: normalizedName,
    });

    if (groupExists) {
      throw new OperationNotValidError({
        reason: 'Group already exists.',
        name,
      });
    }

    const group = await this.groupRepository.saveGroup({
      group: {
        name: normalizedName,
      },
    });

    this.loggerService.debug({
      message: 'Group created.',
      id: group.getId(),
      name,
    });

    return {
      group,
    };
  }
}
