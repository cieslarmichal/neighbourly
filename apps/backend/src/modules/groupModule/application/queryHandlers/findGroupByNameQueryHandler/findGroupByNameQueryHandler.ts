import { type QueryHandler } from '../../../../../common/types/queryHandler.js';
import { type Group } from '../../../domain/entities/group/group.js';

export interface FindGroupByNamePayload {
  name: string;
}

export interface FindGroupByNameResult {
  group: Group;
}

export type FindGroupByNameQueryHandler = QueryHandler<FindGroupByNamePayload, FindGroupByNameResult>;
