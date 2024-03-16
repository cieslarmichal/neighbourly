import {
  type CreatePostCommandHandler,
  type CreatePostPayload,
  type CreatePostResult,
} from './createPostCommandHandler.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type UserRepository } from '../../../../userModule/domain/repositories/userRepository/userRepository.js';
import { type GroupRepository } from '../../../domain/repositories/groupRepository/groupRepository.js';
import { type PostRepository } from '../../../domain/repositories/postRepository/postRepository.js';

export class CreatePostCommandHandlerImpl implements CreatePostCommandHandler {
  public constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: CreatePostPayload): Promise<CreatePostResult> {
    const { userId, groupId, content } = payload;

    this.loggerService.debug({
      message: 'Creating Post...',
      userId,
      groupId,
      content: content.substring(0, 20),
    });

    const user = await this.userRepository.findUser({ id: userId });

    if (!user) {
      throw new OperationNotValidError({
        reason: 'User not found.',
        id: userId,
      });
    }

    const group = await this.groupRepository.findGroup({ id: groupId });

    if (!group) {
      throw new OperationNotValidError({
        reason: 'Group not found.',
        id: groupId,
      });
    }

    const post = await this.postRepository.savePost({
      post: {
        groupId,
        userId,
        content,
      },
    });

    this.loggerService.debug({
      message: 'Post created.',
      id: post.getId(),
      groupId,
      userId,
    });

    return { post };
  }
}
