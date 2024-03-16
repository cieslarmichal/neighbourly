import {
  type UpdatePostCommandHandler,
  type UpdatePostPayload,
  type UpdatePostResult,
} from './updatePostCommandHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type PostRepository } from '../../../domain/repositories/postRepository/postRepository.js';

export class UpdatePostCommandHandlerImpl implements UpdatePostCommandHandler {
  public constructor(
    private readonly postRepository: PostRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: UpdatePostPayload): Promise<UpdatePostResult> {
    const { id, content } = payload;

    this.loggerService.debug({
      message: 'Updating Post...',
      id,
      content: content.substring(0, 20),
    });

    const existingPost = await this.postRepository.findPost({ id });

    if (!existingPost) {
      throw new ResourceNotFoundError({
        name: 'Post',
        id,
      });
    }

    existingPost.setContent({ content });

    const post = await this.postRepository.savePost({ post: existingPost });

    this.loggerService.debug({
      message: 'Post updated.',
      id,
    });

    return { post };
  }
}
