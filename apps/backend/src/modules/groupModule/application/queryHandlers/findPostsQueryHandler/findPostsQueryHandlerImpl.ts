import { type FindPostsResult, type FindPostsQueryHandler, type FindPostsPayload } from './findPostsQueryHandler.js';
import { type PostRepository } from '../../../domain/repositories/postRepository/postRepository.js';

export class FindPostsQueryHandlerImpl implements FindPostsQueryHandler {
  public constructor(private readonly postRepository: PostRepository) {}

  public async execute(payload: FindPostsPayload): Promise<FindPostsResult> {
    const { groupId } = payload;

    const posts = await this.postRepository.findPosts({ groupId });

    return { posts };
  }
}
