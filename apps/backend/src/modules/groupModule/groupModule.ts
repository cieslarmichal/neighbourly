import { GroupHttpController } from './api/httpControllers/groupHttpController/groupHttpController.js';
import { type CreateGroupCommandHandler } from './application/commandHandlers/createGroupCommandHandler/createGroupCommandHandler.js';
import { CreateGroupCommandHandlerImpl } from './application/commandHandlers/createGroupCommandHandler/createGroupCommandHandlerImpl.js';
import { type DeleteGroupCommandHandler } from './application/commandHandlers/deleteGroupCommandHandler/deleteGroupCommandHandler.js';
import { DeleteGroupCommandHandlerImpl } from './application/commandHandlers/deleteGroupCommandHandler/deleteGroupCommandHandlerImpl.js';
import { type UpdateGroupNameCommandHandler } from './application/commandHandlers/updateGroupNameCommandHandler/updateGroupNameCommandHandler.js';
import { UpdateGroupNameCommandHandlerImpl } from './application/commandHandlers/updateGroupNameCommandHandler/updateGroupNameCommandHandlerImpl.js';
import { type FindGroupByIdQueryHandler } from './application/queryHandlers/findGroupByIdQueryHandler/findGroupByIdQueryHandler.js';
import { type FindGroupByNameQueryHandler } from './application/queryHandlers/findGroupByNameQueryHandler/findGroupByNameQueryHandler.js';
import { FindGroupByNameQueryHandlerImpl } from './application/queryHandlers/findGroupByNameQueryHandler/findGroupByNameQueryHandlerImpl.js';
import { type FindGroupsQueryHandler } from './application/queryHandlers/findGroupsQueryHandler/findGroupsQueryHandler.js';
import { FindGroupsQueryHandlerImpl } from './application/queryHandlers/findGroupsQueryHandler/findGroupsQueryHandlerImpl.js';
import { type GroupRepository } from './domain/repositories/groupRepository/groupRepository.js';
import { type GroupMapper } from './infrastructure/repositories/groupRepository/groupMapper/groupMapper.js';
import { GroupMapperImpl } from './infrastructure/repositories/groupRepository/groupMapper/groupMapperImpl.js';
import { GroupRepositoryImpl } from './infrastructure/repositories/groupRepository/groupRepositoryImpl.js';
import { symbols } from './symbols.js';
import { coreSymbols } from '../../core/symbols.js';
import { type DatabaseClient } from '../../libs/database/clients/databaseClient/databaseClient.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type DependencyInjectionModule } from '../../libs/dependencyInjection/dependencyInjectionModule.js';
import { type LoggerService } from '../../libs/logger/services/loggerService/loggerService.js';
import { type UuidService } from '../../libs/uuid/services/uuidService/uuidService.js';
import { type AccessControlService } from '../authModule/application/services/accessControlService/accessControlService.js';
import { authSymbols } from '../authModule/symbols.js';

export class GroupModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    container.bind<GroupMapper>(symbols.groupMapper, () => new GroupMapperImpl());

    this.bindRepositories(container);

    this.bindCommandHandlers(container);

    this.bindQueryHandlers(container);

    this.bindHttpControllers(container);
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

    container.bind<UpdateGroupNameCommandHandler>(
      symbols.updateGroupNameCommandHandler,
      () =>
        new UpdateGroupNameCommandHandlerImpl(
          container.get<GroupRepository>(symbols.groupRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );
  }

  private bindQueryHandlers(container: DependencyInjectionContainer): void {
    container.bind<FindGroupByNameQueryHandler>(
      symbols.findGroupByNameQueryHandler,
      () => new FindGroupByNameQueryHandlerImpl(container.get<GroupRepository>(symbols.groupRepository)),
    );

    container.bind<FindGroupsQueryHandler>(
      symbols.findGroupsQueryHandler,
      () => new FindGroupsQueryHandlerImpl(container.get<GroupRepository>(symbols.groupRepository)),
    );
  }

  private bindHttpControllers(container: DependencyInjectionContainer): void {
    container.bind<GroupHttpController>(
      symbols.groupHttpController,
      () =>
        new GroupHttpController(
          container.get<CreateGroupCommandHandler>(symbols.createGroupCommandHandler),
          container.get<UpdateGroupNameCommandHandler>(symbols.updateGroupNameCommandHandler),
          container.get<DeleteGroupCommandHandler>(symbols.deleteGroupCommandHandler),
          container.get<FindGroupsQueryHandler>(symbols.findGroupsQueryHandler),
          container.get<FindGroupByNameQueryHandler>(symbols.findGroupByNameQueryHandler),
          container.get<FindGroupByIdQueryHandler>(symbols.findGroupByIdQueryHandler),
          container.get<AccessControlService>(authSymbols.accessControlService),
        ),
    );
  }
}
