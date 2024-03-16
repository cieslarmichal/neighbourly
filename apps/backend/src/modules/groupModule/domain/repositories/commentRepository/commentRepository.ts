import { type CommentState, type Comment } from '../../entities/comment/comment.js';

export interface FindCommentPayload {
  readonly id: string;
}

export interface SaveCommentPayload {
  readonly comment: CommentState | Comment;
}

export interface FindComments {
  readonly postId: string;
}

export interface DeleteCommentPayload {
  readonly id: string;
}

export interface CommentRepository {
  findComment(payload: FindCommentPayload): Promise<Comment | null>;
  findComments(payload: FindComments): Promise<Comment[]>;
  saveComment(payload: SaveCommentPayload): Promise<Comment>;
  deleteComment(payload: DeleteCommentPayload): Promise<void>;
}
