import { type QueryHandler } from '../../../../../common/types/queryHandler.js';
import { type Group } from '../../../domain/entities/group/group.js';

export interface FindGroupByIdPayload {
  id: string;
}

export interface FindGroupByIdResult {
  group: Group;
}

export type FindGroupByIdQueryHandler = QueryHandler<FindGroupByIdPayload, FindGroupByIdResult>;
