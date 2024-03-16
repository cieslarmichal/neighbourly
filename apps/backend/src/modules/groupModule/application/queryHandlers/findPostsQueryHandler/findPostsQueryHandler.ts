import { type QueryHandler } from '../../../../../common/types/queryHandler.js';
import { type Post } from '../../../domain/entities/post/post.js';

export interface FindPostsPayload {
  readonly groupId: string;
}

export interface FindPostsResult {
  readonly posts: Post[];
}

export type FindPostsQueryHandler = QueryHandler<FindPostsPayload, FindPostsResult>;
