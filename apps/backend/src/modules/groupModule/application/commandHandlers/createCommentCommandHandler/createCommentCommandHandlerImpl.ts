import {
  type CreateCommentCommandHandler,
  type CreateCommentPayload,
  type CreateCommentResult,
} from './createCommentCommandHandler.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type UserRepository } from '../../../../userModule/domain/repositories/userRepository/userRepository.js';
import { type CommentRepository } from '../../../domain/repositories/commentRepository/commentRepository.js';
import { type PostRepository } from '../../../domain/repositories/postRepository/postRepository.js';

export class CreateCommentCommandHandlerImpl implements CreateCommentCommandHandler {
  public constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userRepository: UserRepository,
    private readonly postRepository: PostRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: CreateCommentPayload): Promise<CreateCommentResult> {
    const { userId, postId, content } = payload;

    this.loggerService.debug({
      message: 'Creating Comment...',
      userId,
      postId,
      content: content.substring(0, 20),
    });

    const user = await this.userRepository.findUser({ id: userId });

    if (!user) {
      throw new OperationNotValidError({
        reason: 'User not found.',
        id: userId,
      });
    }

    const post = await this.postRepository.findPost({ id: postId });

    if (!post) {
      throw new OperationNotValidError({
        reason: 'Post not found.',
        id: postId,
      });
    }

    const comment = await this.commentRepository.saveComment({
      comment: {
        postId,
        userId,
        content,
      },
    });

    this.loggerService.debug({
      message: 'Comment created.',
      id: comment.getId(),
      postId,
      userId,
    });

    return { comment };
  }
}
