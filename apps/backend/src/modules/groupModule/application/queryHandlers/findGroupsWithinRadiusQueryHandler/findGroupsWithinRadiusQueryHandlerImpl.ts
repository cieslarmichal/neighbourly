import {
  type FindGroupsWithinRadiusPayload,
  type FindGroupsWithinRadiusQueryHandler,
} from './findGroupsWithinRadiusQueryHandler.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type Group } from '../../../domain/entities/group/group.js';
import { type GroupRepository } from '../../../domain/repositories/groupRepository/groupRepository.js';

export class FindGroupsWithinRadiusQueryHandlerImpl implements FindGroupsWithinRadiusQueryHandler {
  public constructor(
    private readonly groupRepository: GroupRepository,
    private readonly radiusLimit: number,
  ) {}

  public async execute(payload: FindGroupsWithinRadiusPayload): Promise<Group[]> {
    const { latitude, longitude, radius } = payload;

    if (radius > this.radiusLimit) {
      throw new OperationNotValidError({
        reason: `Radius cannot be greater than ${this.radiusLimit} meters.`,
      });
    }

    return this.groupRepository.findGroupsWithinRadius({
      latitude,
      longitude,
      radius,
    });
  }
}
