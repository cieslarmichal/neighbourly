import { type Post } from './post.js';

export interface UpdatePostPathParams {
  readonly postId: string;
}

export interface UpdatePostRequestBody {
  readonly content: string;
}

export type UpdatePostResponseBody = Post;
