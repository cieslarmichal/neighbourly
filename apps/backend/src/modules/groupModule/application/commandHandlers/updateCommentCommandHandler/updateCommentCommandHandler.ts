import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type Comment } from '../../../domain/entities/comment/comment.js';

export interface UpdateCommentPayload {
  readonly id: string;
  readonly content: string;
}

export interface UpdateCommentResult {
  readonly comment: Comment;
}

export type UpdateCommentCommandHandler = CommandHandler<UpdateCommentPayload, UpdateCommentResult>;
