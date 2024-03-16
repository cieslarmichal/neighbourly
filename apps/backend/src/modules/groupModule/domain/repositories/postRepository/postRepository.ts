import { type PostState, type Post } from '../../entities/post/post.js';

export interface FindPostPayload {
  readonly id: string;
}

export interface SavePostPayload {
  readonly post: PostState | Post;
}

export interface FindPosts {
  readonly groupId: string;
}

export interface DeletePostPayload {
  readonly id: string;
}

export interface PostRepository {
  findPost(payload: FindPostPayload): Promise<Post | null>;
  findPosts(payload: FindPosts): Promise<Post[]>;
  savePost(payload: SavePostPayload): Promise<Post>;
  deletePost(payload: DeletePostPayload): Promise<void>;
}
