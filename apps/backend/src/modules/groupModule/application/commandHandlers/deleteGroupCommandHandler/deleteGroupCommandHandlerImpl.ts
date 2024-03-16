import { type DeleteGroupCommandHandler, type DeleteGroupPayload } from './deleteGroupCommandHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type GroupRepository } from '../../../domain/repositories/groupRepository/groupRepository.js';

export class DeleteGroupCommandHandlerImpl implements DeleteGroupCommandHandler {
  public constructor(
    private readonly groupRepository: GroupRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: DeleteGroupPayload): Promise<void> {
    const { id } = payload;

    this.loggerService.debug({
      message: 'Deleting Group...',
      id,
    });

    const group = await this.groupRepository.findGroup({
      id,
    });

    if (!group) {
      throw new ResourceNotFoundError({
        name: 'Group',
        id,
      });
    }

    await this.groupRepository.deleteGroup({ id: group.getId() });

    this.loggerService.debug({
      message: 'Group deleted.',
      id,
    });
  }
}
