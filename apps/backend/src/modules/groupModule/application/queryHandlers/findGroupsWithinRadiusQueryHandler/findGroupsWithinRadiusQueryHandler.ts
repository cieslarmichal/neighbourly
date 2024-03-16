import { type QueryHandler } from '../../../../../common/types/queryHandler.js';
import { type Group } from '../../../domain/entities/group/group.js';

export interface FindGroupsWithinRadiusPayload {
  latitude: number;
  longitude: number;
  radius: number;
}

export type FindGroupsWithinRadiusQueryHandler = QueryHandler<FindGroupsWithinRadiusPayload, Group[]>;
