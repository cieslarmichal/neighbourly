import { type QueryHandler } from '../../../../../common/types/queryHandler.js';
import { type Group } from '../../../domain/entities/group/group.js';

export interface FindGroupsResult {
  groups: Group[];
}

export type FindGroupsQueryHandler = QueryHandler<void, FindGroupsResult>;
