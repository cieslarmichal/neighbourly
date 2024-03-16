import { type Post } from './post.js';

export interface CreatePostPathParams {
  readonly groupId: string;
}

export interface CreatePostRequestBody {
  readonly content: string;
}

export type CreatePostResponseBody = Post;
