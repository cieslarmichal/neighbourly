import {
  type FindGroupsByUserResult,
  type FindGroupsByUserPayload,
  type FindGroupsByUserQueryHandler,
} from './findGroupsByUserQueryHandler.js';
import { type UserGroupRepository } from '../../../domain/repositories/userGroupRepository/userGroupRepository.js';

export class FindGroupsByUserQueryHandlerImpl implements FindGroupsByUserQueryHandler {
  public constructor(private readonly userGroupRepository: UserGroupRepository) {}

  public async execute(payload: FindGroupsByUserPayload): Promise<FindGroupsByUserResult> {
    const { userId } = payload;

    const groups = await this.userGroupRepository.findGroups({ userId });

    return { groups };
  }
}
