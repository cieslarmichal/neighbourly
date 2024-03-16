import {
  type FindGroupByNamePayload,
  type FindGroupByNameQueryHandler,
  type FindGroupByNameResult,
} from './findGroupByNameQueryHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type GroupRepository } from '../../../domain/repositories/groupRepository/groupRepository.js';

export class FindGroupByNameQueryHandlerImpl implements FindGroupByNameQueryHandler {
  public constructor(private readonly groupRepository: GroupRepository) {}

  public async execute(payload: FindGroupByNamePayload): Promise<FindGroupByNameResult> {
    const { name } = payload;

    const normalizedName = name.toLowerCase();

    const group = await this.groupRepository.findGroup({
      name: normalizedName,
    });

    if (!group) {
      throw new ResourceNotFoundError({
        name: 'Group',
        groupName: name,
      });
    }

    return {
      group,
    };
  }
}
