import {
  type FindUsersByGroupPayload,
  type FindUsersByGroupQueryHandler,
  type FindUsersByGroupResult,
} from './findUsersByGroupQueryHandler.js';
import { type UserGroupRepository } from '../../../domain/repositories/userGroupRepository/userGroupRepository.js';

export class FindUsersByGroupQueryHandlerImpl implements FindUsersByGroupQueryHandler {
  public constructor(private readonly userGroupRepository: UserGroupRepository) {}

  public async execute(payload: FindUsersByGroupPayload): Promise<FindUsersByGroupResult> {
    const { groupId } = payload;

    const users = await this.userGroupRepository.findUsers({ groupId });

    return { users };
  }
}
