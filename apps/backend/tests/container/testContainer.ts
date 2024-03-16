import { testSymbols } from './symbols.js';
import { Application } from '../../src/core/application.js';
import { type SqliteDatabaseClient } from '../../src/core/database/sqliteDatabaseClient/sqliteDatabaseClient.js';
import { coreSymbols } from '../../src/core/symbols.js';
import { type DependencyInjectionContainer } from '../../src/libs/dependencyInjection/dependencyInjectionContainer.js';
import { GroupTestUtils } from '../../src/modules/groupModule/tests/utils/groupTestUtils/groupTestUtils.js';
import { type EmailService } from '../../src/modules/userModule/application/services/emailService/emailService.js';
import { symbols as userSymbols } from '../../src/modules/userModule/symbols.js';
import { BlacklistTokenTestUtils } from '../../src/modules/userModule/tests/utils/blacklistTokenTestUtils/blacklistTokenTestUtils.js';
import { EmailEventTestUtils } from '../../src/modules/userModule/tests/utils/emailEventTestUtils/emailEventTestUtils.js';
import { UserTestUtils } from '../../src/modules/userModule/tests/utils/userTestUtils/userTestUtils.js';

export class TestContainer {
  public static create(): DependencyInjectionContainer {
    const container = Application.createContainer();

    container.bind<GroupTestUtils>(
      testSymbols.groupTestUtils,
      () => new GroupTestUtils(container.get<SqliteDatabaseClient>(coreSymbols.databaseClient)),
    );

    container.bind<UserTestUtils>(
      testSymbols.userTestUtils,
      () => new UserTestUtils(container.get<SqliteDatabaseClient>(coreSymbols.databaseClient)),
    );

    container.bind<BlacklistTokenTestUtils>(
      testSymbols.blacklistTokenTestUtils,
      () => new BlacklistTokenTestUtils(container.get<SqliteDatabaseClient>(coreSymbols.databaseClient)),
    );

    container.bind<EmailEventTestUtils>(
      testSymbols.emailEventTestUtils,
      () => new EmailEventTestUtils(container.get<SqliteDatabaseClient>(coreSymbols.entityEventsDatabaseClient)),
    );

    container.overrideBinding<EmailService>(userSymbols.emailService, () => ({
      sendEmail: async (): Promise<void> => {},
    }));

    return container;
  }
}
