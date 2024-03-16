import {
  type FindCommentsResult,
  type FindCommentsQueryHandler,
  type FindCommentsPayload,
} from './findCommentsQueryHandler.js';
import { type CommentRepository } from '../../../domain/repositories/commentRepository/commentRepository.js';

export class FindCommentsQueryHandlerImpl implements FindCommentsQueryHandler {
  public constructor(private readonly commentRepository: CommentRepository) {}

  public async execute(payload: FindCommentsPayload): Promise<FindCommentsResult> {
    const { postId } = payload;

    const comments = await this.commentRepository.findComments({ postId });

    return { comments };
  }
}
