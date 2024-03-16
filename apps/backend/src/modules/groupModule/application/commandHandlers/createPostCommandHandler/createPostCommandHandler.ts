import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type Post } from '../../../domain/entities/post/post.js';

export interface CreatePostPayload {
  readonly userId: string;
  readonly groupId: string;
  readonly content: string;
}

export interface CreatePostResult {
  readonly post: Post;
}

export type CreatePostCommandHandler = CommandHandler<CreatePostPayload, CreatePostResult>;
