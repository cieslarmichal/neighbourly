import { type Post } from './post.js';

export interface FindPostsPathParams {
  readonly groupId: string;
}

export interface FindPostsResponseBody {
  readonly data: Post[];
}
