import { type FindGroupsResult, type FindGroupsQueryHandler } from './findGroupsQueryHandler.js';
import { type GroupRepository } from '../../../domain/repositories/groupRepository/groupRepository.js';

export class FindGroupsQueryHandlerImpl implements FindGroupsQueryHandler {
  public constructor(private readonly groupRepository: GroupRepository) {}

  public async execute(): Promise<FindGroupsResult> {
    const groups = await this.groupRepository.findAllGroups();

    return {
      groups,
    };
  }
}
