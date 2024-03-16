import { type Comment } from './comment.js';

export interface CreateCommentPathParams {
  readonly postId: string;
}

export interface CreateCommentRequestBody {
  readonly content: string;
}

export type CreateCommentResponseBody = Comment;
