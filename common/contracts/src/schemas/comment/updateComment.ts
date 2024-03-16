import { type Comment } from './comment.js';

export interface UpdateCommentPathParams {
  readonly commentId: string;
}

export interface UpdateCommentRequestBody {
  readonly content: string;
}

export type UpdateCommentResponseBody = Comment;
