import { type QueryHandler } from '../../../../../common/types/queryHandler.js';
import { type Comment } from '../../../domain/entities/comment/comment.js';

export interface FindCommentsPayload {
  readonly postId: string;
}

export interface FindCommentsResult {
  readonly comments: Comment[];
}

export type FindCommentsQueryHandler = QueryHandler<FindCommentsPayload, FindCommentsResult>;
