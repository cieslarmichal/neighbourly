import { type DeletePostCommandHandler, type DeletePostPayload } from './deletePostCommandHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type PostRepository } from '../../../domain/repositories/postRepository/postRepository.js';

export class DeletePostCommandHandlerImpl implements DeletePostCommandHandler {
  public constructor(
    private readonly postRepository: PostRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: DeletePostPayload): Promise<void> {
    const { id } = payload;

    this.loggerService.debug({
      message: 'Deleting Post...',
      id,
    });

    const post = await this.postRepository.findPost({
      id,
    });

    if (!post) {
      throw new ResourceNotFoundError({
        name: 'Post',
        id,
      });
    }

    await this.postRepository.deletePost({ id: post.getId() });

    this.loggerService.debug({
      message: 'Post deleted.',
      id,
    });
  }
}
