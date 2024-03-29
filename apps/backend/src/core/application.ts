import { ApplicationHttpController } from './api/httpControllers/applicationHttpController/applicationHttpController.js';
import { type Config, ConfigFactory } from './config.js';
import { HttpServer } from './httpServer/httpServer.js';
import { QueueRouter } from './queueRouter/queueRouter.js';
import { coreSymbols, symbols } from './symbols.js';
import { type DatabaseClient } from '../libs/database/clients/databaseClient/databaseClient.js';
import { DatabaseClientFactory } from '../libs/database/factories/databaseClientFactory/databaseClientFactory.js';
import { DatabaseClientType } from '../libs/database/types/databaseClientType.js';
import { type DependencyInjectionContainer } from '../libs/dependencyInjection/dependencyInjectionContainer.js';
import { DependencyInjectionContainerFactory } from '../libs/dependencyInjection/dependencyInjectionContainerFactory.js';
import { type DependencyInjectionModule } from '../libs/dependencyInjection/dependencyInjectionModule.js';
import { HttpServiceFactory } from '../libs/httpService/factories/httpServiceFactory/httpServiceFactory.js';
import { type HttpService } from '../libs/httpService/services/httpService/httpService.js';
import { LoggerServiceFactory } from '../libs/logger/factories/loggerServiceFactory/loggerServiceFactory.js';
import { type LoggerService } from '../libs/logger/services/loggerService/loggerService.js';
import { SendGridServiceFactory } from '../libs/sendGrid/factories/sendGridServiceFactory/sendGridServiceFactory.js';
import { type SendGridService } from '../libs/sendGrid/services/sendGridService/sendGridService.js';
import { type UuidService } from '../libs/uuid/services/uuidService/uuidService.js';
import { UuidServiceImpl } from '../libs/uuid/services/uuidService/uuidServiceImpl.js';
import { AddressModule } from '../modules/addressModule/addressModule.js';
import { AddressDatabaseManager } from '../modules/addressModule/infrastructure/databases/addressDatabase/addressDatabaseManager.js';
import { AuthModule } from '../modules/authModule/authModule.js';
import { GroupModule } from '../modules/groupModule/groupModule.js';
import { GroupDatabaseManager } from '../modules/groupModule/infrastructure/databases/groupDatabase/groupDatabaseManager.js';
import { UserGroupDatabaseManager } from '../modules/userGroupModule/infrastructure/databases/userGroupDatabase/userGroupDatabaseManager.js';
import { UserGroupModule } from '../modules/userGroupModule/userGroupModule.js';
import { UserDatabaseManager } from '../modules/userModule/infrastructure/databases/userDatabase/userDatabaseManager.js';
import { UserEventsDatabaseManager } from '../modules/userModule/infrastructure/databases/userEventsDatabase/userEventsDatabaseManager.js';
import { UserModule } from '../modules/userModule/userModule.js';

export class Application {
  private static async setupDatabase(container: DependencyInjectionContainer): Promise<void> {
    const databaseManagers = [
      UserDatabaseManager,
      GroupDatabaseManager,
      UserEventsDatabaseManager,
      UserGroupDatabaseManager,
      AddressDatabaseManager,
    ];

    for await (const databaseManager of databaseManagers) {
      await databaseManager.bootstrapDatabase(container);
    }
  }

  public static createContainer(): DependencyInjectionContainer {
    const modules: DependencyInjectionModule[] = [
      new UserModule(),
      new AuthModule(),
      new GroupModule(),
      new UserGroupModule(),
      new AddressModule(),
    ];

    const container = DependencyInjectionContainerFactory.create({ modules });

    const config = ConfigFactory.create();

    container.bind<LoggerService>(symbols.loggerService, () =>
      LoggerServiceFactory.create({ logLevel: config.logLevel }),
    );

    container.bind<HttpService>(symbols.httpService, () =>
      new HttpServiceFactory(container.get<LoggerService>(symbols.loggerService)).create(),
    );

    container.bind<UuidService>(symbols.uuidService, () => new UuidServiceImpl());

    container.bind<Config>(symbols.config, () => config);

    container.bind<DatabaseClient>(symbols.databaseClient, () =>
      DatabaseClientFactory.create({
        clientType: DatabaseClientType.postgres,
        minPoolConnections: 1,
        maxPoolConnections: 10,
        port: 5432,
        ...config.database,
      }),
    );

    container.bind<DatabaseClient>(symbols.entityEventsDatabaseClient, () =>
      DatabaseClientFactory.create({
        clientType: DatabaseClientType.postgres,
        minPoolConnections: 1,
        maxPoolConnections: 10,
        port: 5432,
        ...config.database,
      }),
    );

    container.bind<ApplicationHttpController>(
      symbols.applicationHttpController,
      () => new ApplicationHttpController(container.get<DatabaseClient>(coreSymbols.databaseClient)),
    );

    container.bind<SendGridService>(symbols.sendGridService, () =>
      new SendGridServiceFactory(container.get<HttpService>(coreSymbols.httpService)).create({
        apiKey: config.sendGrid.apiKey,
        senderEmail: config.sendGrid.senderEmail,
      }),
    );

    return container;
  }

  public static async start(): Promise<void> {
    const container = Application.createContainer();

    const loggerService = container.get<LoggerService>(coreSymbols.loggerService);

    await this.setupDatabase(container);

    loggerService.info({ message: 'Migrations executed.' });

    const server = new HttpServer(container);

    const queueRouter = new QueueRouter(container);

    await server.start();

    await queueRouter.start();
  }
}
