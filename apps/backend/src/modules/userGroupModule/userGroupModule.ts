import { UserGroupHttpController } from './api/httpControllers/userGroupHttpController/userGroupHttpController.js';
import { type CreateUserGroupCommandHandler } from './application/commandHandlers/createUserGroupCommandHandler/createUserGroupCommandHandler.js';
import { CreateUserGroupCommandHandlerImpl } from './application/commandHandlers/createUserGroupCommandHandler/createUserGroupCommandHandlerImpl.js';
import { type DeleteUserGroupCommandHandler } from './application/commandHandlers/deleteUserGroupCommandHandler/deleteUserGroupCommandHandler.js';
import { DeleteUserGroupCommandHandlerImpl } from './application/commandHandlers/deleteUserGroupCommandHandler/deleteUserGroupCommandHandlerImpl.js';
import { type UpdateUserGroupCommandHandler } from './application/commandHandlers/updateUserGroupCommandHandler/updateUserGroupCommandHandler.js';
import { UpdateUserGroupCommandHandlerImpl } from './application/commandHandlers/updateUserGroupCommandHandler/updateUserGroupCommandHandlerImpl.js';
import { type FindGroupsByUserQueryHandler } from './application/queryHandlers/findGroupsByUserQueryHandler/findGroupsByUserQueryHandler.js';
import { FindGroupsByUserQueryHandlerImpl } from './application/queryHandlers/findGroupsByUserQueryHandler/findGroupsByUserQueryHandlerImpl.js';
import { type FindUsersByGroupQueryHandler } from './application/queryHandlers/findUsersByGroupQueryHandler/findUsersByGroupQueryHandler.js';
import { FindUsersByGroupQueryHandlerImpl } from './application/queryHandlers/findUsersByGroupQueryHandler/findUsersByGroupQueryHandlerImpl.js';
import { type UserGroupRepository } from './domain/repositories/userGroupRepository/userGroupRepository.js';
import { type UserGroupMapper } from './infrastructure/repositories/userGroupRepository/userGroupMapper/userGroupMapper.js';
import { UserGroupMapperImpl } from './infrastructure/repositories/userGroupRepository/userGroupMapper/userGroupMapperImpl.js';
import { UserGroupRepositoryImpl } from './infrastructure/repositories/userGroupRepository/userGroupRepositoryImpl.js';
import { symbols } from './symbols.js';
import { coreSymbols } from '../../core/symbols.js';
import { type DatabaseClient } from '../../libs/database/clients/databaseClient/databaseClient.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type DependencyInjectionModule } from '../../libs/dependencyInjection/dependencyInjectionModule.js';
import { type LoggerService } from '../../libs/logger/services/loggerService/loggerService.js';
import { type UuidService } from '../../libs/uuid/services/uuidService/uuidService.js';
import { type AccessControlService } from '../authModule/application/services/accessControlService/accessControlService.js';
import { authSymbols } from '../authModule/symbols.js';
import { type GroupRepository } from '../groupModule/domain/repositories/groupRepository/groupRepository.js';
import { type GroupMapper } from '../groupModule/infrastructure/repositories/groupRepository/groupMapper/groupMapper.js';
import { groupSymbols } from '../groupModule/symbols.js';
import { type UserRepository } from '../userModule/domain/repositories/userRepository/userRepository.js';
import { type UserMapper } from '../userModule/infrastructure/repositories/userRepository/userMapper/userMapper.js';
import { userSymbols } from '../userModule/symbols.js';

export class UserGroupModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    container.bind<UserGroupMapper>(symbols.userGroupMapper, () => new UserGroupMapperImpl());

    container.bind<UserGroupRepository>(
      symbols.userGroupRepository,
      () =>
        new UserGroupRepositoryImpl(
          container.get<DatabaseClient>(coreSymbols.databaseClient),
          container.get<UserGroupMapper>(symbols.userGroupMapper),
          container.get<UserMapper>(userSymbols.userMapper),
          container.get<GroupMapper>(groupSymbols.groupMapper),
          container.get<UuidService>(coreSymbols.uuidService),
        ),
    );

    container.bind<CreateUserGroupCommandHandler>(
      symbols.createUserGroupCommandHandler,
      () =>
        new CreateUserGroupCommandHandlerImpl(
          container.get<UserGroupRepository>(symbols.userGroupRepository),
          container.get<UserRepository>(userSymbols.userRepository),
          container.get<GroupRepository>(groupSymbols.groupRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<UpdateUserGroupCommandHandler>(
      symbols.updateUserGroupCommandHandler,
      () =>
        new UpdateUserGroupCommandHandlerImpl(
          container.get<UserGroupRepository>(symbols.userGroupRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<DeleteUserGroupCommandHandler>(
      symbols.deleteUserGroupCommandHandler,
      () =>
        new DeleteUserGroupCommandHandlerImpl(
          container.get<UserGroupRepository>(symbols.userGroupRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<FindUsersByGroupQueryHandler>(
      symbols.findUsersByGroupQueryHandler,
      () => new FindUsersByGroupQueryHandlerImpl(container.get<UserGroupRepository>(symbols.userGroupRepository)),
    );

    container.bind<FindGroupsByUserQueryHandler>(
      symbols.findGroupsByUserQueryHandler,
      () => new FindGroupsByUserQueryHandlerImpl(container.get<UserGroupRepository>(symbols.userGroupRepository)),
    );

    container.bind<UserGroupHttpController>(
      symbols.userGroupHttpController,
      () =>
        new UserGroupHttpController(
          container.get<CreateUserGroupCommandHandler>(symbols.createUserGroupCommandHandler),
          container.get<UpdateUserGroupCommandHandler>(symbols.updateUserGroupCommandHandler),
          container.get<DeleteUserGroupCommandHandler>(symbols.deleteUserGroupCommandHandler),
          container.get<FindGroupsByUserQueryHandler>(symbols.findGroupsByUserQueryHandler),
          container.get<FindUsersByGroupQueryHandler>(symbols.findUsersByGroupQueryHandler),
          container.get<AccessControlService>(authSymbols.accessControlService),
        ),
    );
  }
}
