import { type QueryHandler } from '../../../../../common/types/queryHandler.js';
import { type Group } from '../../../../groupModule/domain/entities/group/group.js';

export interface FindGroupsByUserPayload {
  readonly userId: string;
}

export interface FindGroupsByUserResult {
  readonly groups: Group[];
}

export type FindGroupsByUserQueryHandler = QueryHandler<FindGroupsByUserPayload, FindGroupsByUserResult>;
