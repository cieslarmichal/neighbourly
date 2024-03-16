import { type DeleteCommentCommandHandler, type DeleteCommentPayload } from './deleteCommentCommandHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type CommentRepository } from '../../../domain/repositories/commentRepository/commentRepository.js';

export class DeleteCommentCommandHandlerImpl implements DeleteCommentCommandHandler {
  public constructor(
    private readonly commentRepository: CommentRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: DeleteCommentPayload): Promise<void> {
    const { id } = payload;

    this.loggerService.debug({
      message: 'Deleting Comment...',
      id,
    });

    const comment = await this.commentRepository.findComment({
      id,
    });

    if (!comment) {
      throw new ResourceNotFoundError({
        name: 'Comment',
        id,
      });
    }

    await this.commentRepository.deleteComment({ id: comment.getId() });

    this.loggerService.debug({
      message: 'Comment deleted.',
      id,
    });
  }
}
