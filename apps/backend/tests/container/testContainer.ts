import { testSymbols } from './symbols.js';
import { Application } from '../../src/core/application.js';
import { coreSymbols } from '../../src/core/symbols.js';
import { type DatabaseClient } from '../../src/libs/database/clients/databaseClient/databaseClient.js';
import { type DependencyInjectionContainer } from '../../src/libs/dependencyInjection/dependencyInjectionContainer.js';
import { AddressTestUtils } from '../../src/modules/addressModule/tests/utils/addressTestUtils/addressTestUtils.js';
import { CommentTestUtils } from '../../src/modules/groupModule/tests/utils/commentTestUtils/commentTestUtils.js';
import { GroupTestUtils } from '../../src/modules/groupModule/tests/utils/groupTestUtils/groupTestUtils.js';
import { PostTestUtils } from '../../src/modules/groupModule/tests/utils/postTestUtils/postTestUtils.js';
import { UserGroupTestUtils } from '../../src/modules/userGroupModule/tests/utils/userGroupTestUtils/userGroupTestUtils.js';
import { type EmailService } from '../../src/modules/userModule/application/services/emailService/emailService.js';
import { symbols as userSymbols } from '../../src/modules/userModule/symbols.js';
import { BlacklistTokenTestUtils } from '../../src/modules/userModule/tests/utils/blacklistTokenTestUtils/blacklistTokenTestUtils.js';
import { EmailEventTestUtils } from '../../src/modules/userModule/tests/utils/emailEventTestUtils/emailEventTestUtils.js';
import { UserTestUtils } from '../../src/modules/userModule/tests/utils/userTestUtils/userTestUtils.js';

export class TestContainer {
  public static create(): DependencyInjectionContainer {
    const container = Application.createContainer();

    container.bind<CommentTestUtils>(
      testSymbols.commentTestUtils,
      () => new CommentTestUtils(container.get<DatabaseClient>(coreSymbols.databaseClient)),
    );

    container.bind<PostTestUtils>(
      testSymbols.postTestUtils,
      () => new PostTestUtils(container.get<DatabaseClient>(coreSymbols.databaseClient)),
    );

    container.bind<UserGroupTestUtils>(
      testSymbols.userGroupTestUtils,
      () => new UserGroupTestUtils(container.get<DatabaseClient>(coreSymbols.databaseClient)),
    );

    container.bind<UserTestUtils>(
      testSymbols.userTestUtils,
      () => new UserTestUtils(container.get<DatabaseClient>(coreSymbols.databaseClient)),
    );

    container.bind<GroupTestUtils>(
      testSymbols.groupTestUtils,
      () => new GroupTestUtils(container.get<DatabaseClient>(coreSymbols.databaseClient)),
    );

    container.bind<BlacklistTokenTestUtils>(
      testSymbols.blacklistTokenTestUtils,
      () => new BlacklistTokenTestUtils(container.get<DatabaseClient>(coreSymbols.databaseClient)),
    );

    container.bind<EmailEventTestUtils>(
      testSymbols.emailEventTestUtils,
      () => new EmailEventTestUtils(container.get<DatabaseClient>(coreSymbols.entityEventsDatabaseClient)),
    );

    container.bind<AddressTestUtils>(
      testSymbols.addressTestUtils,
      () => new AddressTestUtils(container.get<DatabaseClient>(coreSymbols.databaseClient)),
    );

    container.overrideBinding<EmailService>(userSymbols.emailService, () => ({
      sendEmail: async (): Promise<void> => {},
    }));

    return container;
  }
}
