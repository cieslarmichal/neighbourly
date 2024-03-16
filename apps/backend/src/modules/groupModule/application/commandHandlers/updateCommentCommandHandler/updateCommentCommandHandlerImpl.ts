import {
  type UpdateCommentCommandHandler,
  type UpdateCommentPayload,
  type UpdateCommentResult,
} from './updateCommentCommandHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type CommentRepository } from '../../../domain/repositories/commentRepository/commentRepository.js';

export class UpdateCommentCommandHandlerImpl implements UpdateCommentCommandHandler {
  public constructor(
    private readonly commentRepository: CommentRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: UpdateCommentPayload): Promise<UpdateCommentResult> {
    const { id, content } = payload;

    this.loggerService.debug({
      message: 'Updating Comment...',
      id,
      content: content.substring(0, 20),
    });

    const existingComment = await this.commentRepository.findComment({ id });

    if (!existingComment) {
      throw new ResourceNotFoundError({
        name: 'Comment',
        id,
      });
    }

    existingComment.setContent({ content });

    const comment = await this.commentRepository.saveComment({ comment: existingComment });

    this.loggerService.debug({
      message: 'Comment updated.',
      id,
    });

    return { comment };
  }
}
