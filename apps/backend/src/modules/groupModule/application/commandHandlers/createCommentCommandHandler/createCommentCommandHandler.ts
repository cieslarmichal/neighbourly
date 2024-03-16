import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type Comment } from '../../../domain/entities/comment/comment.js';

export interface CreateCommentPayload {
  readonly userId: string;
  readonly postId: string;
  readonly content: string;
}

export interface CreateCommentResult {
  readonly comment: Comment;
}

export type CreateCommentCommandHandler = CommandHandler<CreateCommentPayload, CreateCommentResult>;
