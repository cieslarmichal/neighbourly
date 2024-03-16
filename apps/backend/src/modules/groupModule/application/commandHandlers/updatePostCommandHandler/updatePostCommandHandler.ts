import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type Post } from '../../../domain/entities/post/post.js';

export interface UpdatePostPayload {
  readonly id: string;
  readonly content: string;
}

export interface UpdatePostResult {
  readonly post: Post;
}

export type UpdatePostCommandHandler = CommandHandler<UpdatePostPayload, UpdatePostResult>;
