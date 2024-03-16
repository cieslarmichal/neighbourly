import {
  type FindGroupsWithinRadiusPayload,
  type FindGroupsWithinRadiusQueryHandler,
} from './findGroupsWithinRadiusQueryHandler.js';
import { type Group } from '../../../domain/entities/group/group.js';
import { type GroupRepository } from '../../../domain/repositories/groupRepository/groupRepository.js';

export class FindGroupsWithinRadiusQueryHandlerImpl implements FindGroupsWithinRadiusQueryHandler {
  public constructor(private readonly groupRepository: GroupRepository) {}

  public async execute(payload: FindGroupsWithinRadiusPayload): Promise<Group[]> {
    const { latitude, longitude, radius } = payload;

    let correctedRadius = radius;

    if (radius > 5000) {
      correctedRadius = 5000;
    }

    return this.groupRepository.findGroupsWithinRadius({
      latitude,
      longitude,
      radius: correctedRadius,
    });
  }
}
