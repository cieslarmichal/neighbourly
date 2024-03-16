import { type QueryHandler } from '../../../../../common/types/queryHandler.js';
import { type User } from '../../../../userModule/domain/entities/user/user.js';

export interface FindUsersByGroupPayload {
  readonly groupId: string;
}

export interface FindUsersByGroupResult {
  readonly users: User[];
}

export type FindUsersByGroupQueryHandler = QueryHandler<FindUsersByGroupPayload, FindUsersByGroupResult>;
