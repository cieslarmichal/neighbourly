import { type Comment } from './comment.js';

export interface FindCommentsPathParams {
  readonly postId: string;
}

export interface FindCommentsResponseBody {
  readonly data: Comment[];
}
