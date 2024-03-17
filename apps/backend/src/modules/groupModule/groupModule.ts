import { GroupHttpController } from './api/httpControllers/groupHttpController/groupHttpController.js';
import { PostHttpController } from './api/httpControllers/postHttpController/postHttpController.js';
import { type ApproveGroupAccessRequestCommandHandler } from './application/commandHandlers/approveGroupAccessRequestCommandHandler/approveGroupAccessRequestCommandHandler.js';
import { ApproveGroupAccessRequestCommandHandlerImpl } from './application/commandHandlers/approveGroupAccessRequestCommandHandler/approveGroupAccessRequestCommandHandlerImpl.js';
import { type CreateCommentCommandHandler } from './application/commandHandlers/createCommentCommandHandler/createCommentCommandHandler.js';
import { CreateCommentCommandHandlerImpl } from './application/commandHandlers/createCommentCommandHandler/createCommentCommandHandlerImpl.js';
import { type CreateGroupCommandHandler } from './application/commandHandlers/createGroupCommandHandler/createGroupCommandHandler.js';
import { CreateGroupCommandHandlerImpl } from './application/commandHandlers/createGroupCommandHandler/createGroupCommandHandlerImpl.js';
import { type CreatePostCommandHandler } from './application/commandHandlers/createPostCommandHandler/createPostCommandHandler.js';
import { CreatePostCommandHandlerImpl } from './application/commandHandlers/createPostCommandHandler/createPostCommandHandlerImpl.js';
import { type DeleteCommentCommandHandler } from './application/commandHandlers/deleteCommentCommandHandler/deleteCommentCommandHandler.js';
import { DeleteCommentCommandHandlerImpl } from './application/commandHandlers/deleteCommentCommandHandler/deleteCommentCommandHandlerImpl.js';
import { type DeleteGroupCommandHandler } from './application/commandHandlers/deleteGroupCommandHandler/deleteGroupCommandHandler.js';
import { DeleteGroupCommandHandlerImpl } from './application/commandHandlers/deleteGroupCommandHandler/deleteGroupCommandHandlerImpl.js';
import { type DeletePostCommandHandler } from './application/commandHandlers/deletePostCommandHandler/deletePostCommandHandler.js';
import { DeletePostCommandHandlerImpl } from './application/commandHandlers/deletePostCommandHandler/deletePostCommandHandlerImpl.js';
import { type RequestGroupAccessCommandHandler } from './application/commandHandlers/requestGroupAccessCommandHandler/requestGroupAccessRequestCommandHandler.js';
import { RequestGroupAccessCommandHandlerImpl } from './application/commandHandlers/requestGroupAccessCommandHandler/requestGroupAccessRequestCommandHandlerImpl.js';
import { type UpdateCommentCommandHandler } from './application/commandHandlers/updateCommentCommandHandler/updateCommentCommandHandler.js';
import { UpdateCommentCommandHandlerImpl } from './application/commandHandlers/updateCommentCommandHandler/updateCommentCommandHandlerImpl.js';
import { type UpdateGroupCommandHandler } from './application/commandHandlers/updateGroupCommandHandler/updateGroupCommandHandler.js';
import { UpdateGroupCommandHandlerImpl } from './application/commandHandlers/updateGroupCommandHandler/updateGroupCommandHandlerImpl.js';
import { type UpdatePostCommandHandler } from './application/commandHandlers/updatePostCommandHandler/updatePostCommandHandler.js';
import { UpdatePostCommandHandlerImpl } from './application/commandHandlers/updatePostCommandHandler/updatePostCommandHandlerImpl.js';
import { type FindCommentsQueryHandler } from './application/queryHandlers/findCommentsQueryHandler/findCommentsQueryHandler.js';
import { FindCommentsQueryHandlerImpl } from './application/queryHandlers/findCommentsQueryHandler/findCommentsQueryHandlerImpl.js';
import { type FindGroupAccessRequestsQueryHandler } from './application/queryHandlers/findGroupAccessRequestsQueryHandler/findGroupAccessRequestsQueryHandler.js';
import { FindGroupAccessRequestsQueryHandlerImpl } from './application/queryHandlers/findGroupAccessRequestsQueryHandler/findGroupAccessRequestsQueryHandlerImpl.js';
import { type FindGroupByIdQueryHandler } from './application/queryHandlers/findGroupByIdQueryHandler/findGroupByIdQueryHandler.js';
import { FindGroupByIdQueryHandlerImpl } from './application/queryHandlers/findGroupByIdQueryHandler/findGroupByIdQueryHandlerImpl.js';
import { type FindGroupByNameQueryHandler } from './application/queryHandlers/findGroupByNameQueryHandler/findGroupByNameQueryHandler.js';
import { FindGroupByNameQueryHandlerImpl } from './application/queryHandlers/findGroupByNameQueryHandler/findGroupByNameQueryHandlerImpl.js';
import { type FindGroupsQueryHandler } from './application/queryHandlers/findGroupsQueryHandler/findGroupsQueryHandler.js';
import { FindGroupsQueryHandlerImpl } from './application/queryHandlers/findGroupsQueryHandler/findGroupsQueryHandlerImpl.js';
import { type FindGroupsWithinRadiusQueryHandler } from './application/queryHandlers/findGroupsWithinRadiusQueryHandler/findGroupsWithinRadiusQueryHandler.js';
import { FindGroupsWithinRadiusQueryHandlerImpl } from './application/queryHandlers/findGroupsWithinRadiusQueryHandler/findGroupsWithinRadiusQueryHandlerImpl.js';
import { type FindPostsQueryHandler } from './application/queryHandlers/findPostsQueryHandler/findPostsQueryHandler.js';
import { FindPostsQueryHandlerImpl } from './application/queryHandlers/findPostsQueryHandler/findPostsQueryHandlerImpl.js';
import { type CommentRepository } from './domain/repositories/commentRepository/commentRepository.js';
import { type GroupAccessRequestRepository } from './domain/repositories/groupAccessRequestRepository/groupAccessRequestRepository.js';
import { type GroupRepository } from './domain/repositories/groupRepository/groupRepository.js';
import { type PostRepository } from './domain/repositories/postRepository/postRepository.js';
import { type CommentMapper } from './infrastructure/repositories/commentRepository/commentMapper/commentMapper.js';
import { CommentMapperImpl } from './infrastructure/repositories/commentRepository/commentMapper/commentMapperImpl.js';
import { CommentRepositoryImpl } from './infrastructure/repositories/commentRepository/commentRepositoryImpl.js';
import { type GroupAccessRequestMapper } from './infrastructure/repositories/groupAccessRequestRepository/groupAccessRequestMapper/groupAccessRequestMapper.js';
import { GroupAccessRequestMapperImpl } from './infrastructure/repositories/groupAccessRequestRepository/groupAccessRequestMapper/groupAccessRequestMapperImpl.js';
import { GroupAccessRequestRepositoryImpl } from './infrastructure/repositories/groupAccessRequestRepository/groupAccessRequestRepositoryImpl.js';
import { type GroupMapper } from './infrastructure/repositories/groupRepository/groupMapper/groupMapper.js';
import { GroupMapperImpl } from './infrastructure/repositories/groupRepository/groupMapper/groupMapperImpl.js';
import { GroupRepositoryImpl } from './infrastructure/repositories/groupRepository/groupRepositoryImpl.js';
import { type PostMapper } from './infrastructure/repositories/postRepository/postMapper/postMapper.js';
import { PostMapperImpl } from './infrastructure/repositories/postRepository/postMapper/postMapperImpl.js';
import { PostRepositoryImpl } from './infrastructure/repositories/postRepository/postRepositoryImpl.js';
import { symbols } from './symbols.js';
import { type Config } from '../../core/config.js';
import { coreSymbols } from '../../core/symbols.js';
import { type DatabaseClient } from '../../libs/database/clients/databaseClient/databaseClient.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type DependencyInjectionModule } from '../../libs/dependencyInjection/dependencyInjectionModule.js';
import { type LoggerService } from '../../libs/logger/services/loggerService/loggerService.js';
import { type UuidService } from '../../libs/uuid/services/uuidService/uuidService.js';
import { type AccessControlService } from '../authModule/application/services/accessControlService/accessControlService.js';
import { authSymbols } from '../authModule/symbols.js';
import { type UserGroupRepository } from '../userGroupModule/domain/repositories/userGroupRepository/userGroupRepository.js';
import { userGroupSymbols } from '../userGroupModule/symbols.js';
import { type UserRepository } from '../userModule/domain/repositories/userRepository/userRepository.js';
import { userSymbols } from '../userModule/symbols.js';

export class GroupModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    this.bindMappers(container);

    this.bindRepositories(container);

    this.bindCommandHandlers(container);

    this.bindQueryHandlers(container);

    this.bindHttpControllers(container);
  }

  private bindMappers(container: DependencyInjectionContainer): void {
    container.bind<GroupMapper>(symbols.groupMapper, () => new GroupMapperImpl());

    container.bind<PostMapper>(symbols.postMapper, () => new PostMapperImpl());

    container.bind<CommentMapper>(symbols.commentMapper, () => new CommentMapperImpl());

    container.bind<GroupAccessRequestMapper>(
      symbols.groupAccessRequestMapper,
      () => new GroupAccessRequestMapperImpl(),
    );
  }

  private bindRepositories(container: DependencyInjectionContainer): void {
    container.bind<GroupRepository>(
      symbols.groupRepository,
      () =>
        new GroupRepositoryImpl(
          container.get<DatabaseClient>(coreSymbols.databaseClient),
          container.get<GroupMapper>(symbols.groupMapper),
          container.get<UuidService>(coreSymbols.uuidService),
        ),
    );

    container.bind<PostRepository>(
      symbols.postRepository,
      () =>
        new PostRepositoryImpl(
          container.get<DatabaseClient>(coreSymbols.databaseClient),
          container.get<PostMapper>(symbols.postMapper),
          container.get<UuidService>(coreSymbols.uuidService),
        ),
    );

    container.bind<CommentRepository>(
      symbols.commentRepository,
      () =>
        new CommentRepositoryImpl(
          container.get<DatabaseClient>(coreSymbols.databaseClient),
          container.get<CommentMapper>(symbols.commentMapper),
          container.get<UuidService>(coreSymbols.uuidService),
        ),
    );

    container.bind<GroupAccessRequestRepository>(
      symbols.groupAccessRequestRepository,
      () =>
        new GroupAccessRequestRepositoryImpl(
          container.get<DatabaseClient>(coreSymbols.databaseClient),
          container.get<GroupAccessRequestMapper>(symbols.groupAccessRequestMapper),
          container.get<UuidService>(coreSymbols.uuidService),
        ),
    );
  }

  private bindCommandHandlers(container: DependencyInjectionContainer): void {
    container.bind<CreateGroupCommandHandler>(
      symbols.createGroupCommandHandler,
      () =>
        new CreateGroupCommandHandlerImpl(
          container.get<GroupRepository>(symbols.groupRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<DeleteGroupCommandHandler>(
      symbols.deleteGroupCommandHandler,
      () =>
        new DeleteGroupCommandHandlerImpl(
          container.get<GroupRepository>(symbols.groupRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<UpdateGroupCommandHandler>(
      symbols.updateGroupCommandHandler,
      () =>
        new UpdateGroupCommandHandlerImpl(
          container.get<GroupRepository>(symbols.groupRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<CreatePostCommandHandler>(
      symbols.createPostCommandHandler,
      () =>
        new CreatePostCommandHandlerImpl(
          container.get<PostRepository>(symbols.postRepository),
          container.get<UserRepository>(userSymbols.userRepository),
          container.get<GroupRepository>(symbols.groupRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<DeletePostCommandHandler>(
      symbols.deletePostCommandHandler,
      () =>
        new DeletePostCommandHandlerImpl(
          container.get<PostRepository>(symbols.postRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<UpdatePostCommandHandler>(
      symbols.updatePostCommandHandler,
      () =>
        new UpdatePostCommandHandlerImpl(
          container.get<PostRepository>(symbols.postRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<RequestGroupAccessCommandHandler>(
      symbols.requestGroupAccessCommandHandler,
      () =>
        new RequestGroupAccessCommandHandlerImpl(
          container.get<GroupAccessRequestRepository>(symbols.groupAccessRequestRepository),
          container.get<UserRepository>(userSymbols.userRepository),
          container.get<GroupRepository>(symbols.groupRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<ApproveGroupAccessRequestCommandHandler>(
      symbols.approveGroupAccessRequestCommandHandler,
      () =>
        new ApproveGroupAccessRequestCommandHandlerImpl(
          container.get<GroupAccessRequestRepository>(symbols.groupAccessRequestRepository),
          container.get<UserGroupRepository>(userGroupSymbols.userGroupRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<CreateCommentCommandHandler>(
      symbols.createCommentCommandHandler,
      () =>
        new CreateCommentCommandHandlerImpl(
          container.get<CommentRepository>(symbols.commentRepository),
          container.get<UserRepository>(userSymbols.userRepository),
          container.get<PostRepository>(symbols.postRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<DeleteCommentCommandHandler>(
      symbols.deleteCommentCommandHandler,
      () =>
        new DeleteCommentCommandHandlerImpl(
          container.get<CommentRepository>(symbols.commentRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<UpdateCommentCommandHandler>(
      symbols.updateCommentCommandHandler,
      () =>
        new UpdateCommentCommandHandlerImpl(
          container.get<CommentRepository>(symbols.commentRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );
  }

  private bindQueryHandlers(container: DependencyInjectionContainer): void {
    container.bind<FindGroupByNameQueryHandler>(
      symbols.findGroupByNameQueryHandler,
      () => new FindGroupByNameQueryHandlerImpl(container.get<GroupRepository>(symbols.groupRepository)),
    );

    container.bind<FindGroupByIdQueryHandler>(
      symbols.findGroupByIdQueryHandler,
      () => new FindGroupByIdQueryHandlerImpl(container.get<GroupRepository>(symbols.groupRepository)),
    );

    container.bind<FindGroupsQueryHandler>(
      symbols.findGroupsQueryHandler,
      () => new FindGroupsQueryHandlerImpl(container.get<GroupRepository>(symbols.groupRepository)),
    );

    container.bind<FindPostsQueryHandler>(
      symbols.findPostsQueryHandler,
      () => new FindPostsQueryHandlerImpl(container.get<PostRepository>(symbols.postRepository)),
    );

    container.bind<FindCommentsQueryHandler>(
      symbols.findCommentsQueryHandler,
      () => new FindCommentsQueryHandlerImpl(container.get<CommentRepository>(symbols.commentRepository)),
    );

    container.bind<FindGroupsWithinRadiusQueryHandler>(
      symbols.findGroupsWithinRadiusQueryHandler,
      () =>
        new FindGroupsWithinRadiusQueryHandlerImpl(
          container.get<GroupRepository>(symbols.groupRepository),
          container.get<Config>(coreSymbols.config).radiusLimit,
        ),
    );

    container.bind<FindGroupAccessRequestsQueryHandler>(
      symbols.findGroupAccessRequestsQueryHandler,
      () =>
        new FindGroupAccessRequestsQueryHandlerImpl(
          container.get<GroupAccessRequestRepository>(symbols.groupAccessRequestRepository),
        ),
    );
  }

  private bindHttpControllers(container: DependencyInjectionContainer): void {
    container.bind<GroupHttpController>(
      symbols.groupHttpController,
      () =>
        new GroupHttpController(
          container.get<CreateGroupCommandHandler>(symbols.createGroupCommandHandler),
          container.get<UpdateGroupCommandHandler>(symbols.updateGroupCommandHandler),
          container.get<DeleteGroupCommandHandler>(symbols.deleteGroupCommandHandler),
          container.get<FindGroupsQueryHandler>(symbols.findGroupsQueryHandler),
          container.get<FindGroupByNameQueryHandler>(symbols.findGroupByNameQueryHandler),
          container.get<FindGroupByIdQueryHandler>(symbols.findGroupByIdQueryHandler),
          container.get<FindGroupsWithinRadiusQueryHandler>(symbols.findGroupsWithinRadiusQueryHandler),
          container.get<RequestGroupAccessCommandHandler>(symbols.requestGroupAccessCommandHandler),
          container.get<ApproveGroupAccessRequestCommandHandler>(symbols.approveGroupAccessRequestCommandHandler),
          container.get<FindGroupAccessRequestsQueryHandler>(symbols.findGroupAccessRequestsQueryHandler),
          container.get<AccessControlService>(authSymbols.accessControlService),
        ),
    );

    container.bind<PostHttpController>(
      symbols.postHttpController,
      () =>
        new PostHttpController(
          container.get<CreatePostCommandHandler>(symbols.createPostCommandHandler),
          container.get<UpdatePostCommandHandler>(symbols.updatePostCommandHandler),
          container.get<DeletePostCommandHandler>(symbols.deletePostCommandHandler),
          container.get<FindPostsQueryHandler>(symbols.findPostsQueryHandler),
          container.get<CreateCommentCommandHandler>(symbols.createCommentCommandHandler),
          container.get<UpdateCommentCommandHandler>(symbols.updateCommentCommandHandler),
          container.get<DeleteCommentCommandHandler>(symbols.deleteCommentCommandHandler),
          container.get<FindCommentsQueryHandler>(symbols.findCommentsQueryHandler),
          container.get<AccessControlService>(authSymbols.accessControlService),
        ),
    );
  }
}
