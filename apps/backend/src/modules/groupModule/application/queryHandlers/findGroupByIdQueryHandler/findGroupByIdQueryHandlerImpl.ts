import {
  type FindGroupByIdPayload,
  type FindGroupByIdQueryHandler,
  type FindGroupByIdResult,
} from './findGroupByIdQueryHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type GroupRepository } from '../../../domain/repositories/groupRepository/groupRepository.js';

export class FindGroupByIdQueryHandlerImpl implements FindGroupByIdQueryHandler {
  public constructor(private readonly groupRepository: GroupRepository) {}

  public async execute(payload: FindGroupByIdPayload): Promise<FindGroupByIdResult> {
    const { id } = payload;

    const group = await this.groupRepository.findGroup({
      id,
    });

    if (!group) {
      throw new ResourceNotFoundError({
        name: 'Group',
        id,
      });
    }

    return {
      group,
    };
  }
}
