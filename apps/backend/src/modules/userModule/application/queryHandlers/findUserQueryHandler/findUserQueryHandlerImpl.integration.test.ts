import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { type FindUserQueryHandler } from './findUserQueryHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { Application } from '../../../../../core/application.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { symbols } from '../../../symbols.js';
import { UserTestFactory } from '../../../tests/factories/userTestFactory/userTestFactory.js';
import { UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.js';

describe('FindUserQueryHandler', () => {
  let findUserQueryHandler: FindUserQueryHandler;

  let databaseClient: DatabaseClient;

  let userTestUtils: UserTestUtils;

  const userTestFactory = new UserTestFactory();

  beforeEach(async () => {
    const container = Application.createContainer();

    findUserQueryHandler = container.get<FindUserQueryHandler>(symbols.findUserQueryHandler);

    databaseClient = container.get<DatabaseClient>(coreSymbols.databaseClient);

    userTestUtils = new UserTestUtils(databaseClient);

    await userTestUtils.truncate();
  });

  afterEach(async () => {
    await userTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('finds a User by id', async () => {
    const user = await userTestUtils.createAndPersist();

    const { user: foundUser } = await findUserQueryHandler.execute({ userId: user.id });

    expect(foundUser).not.toBeNull();
  });

  it('throws an error if a User with given id does not exist', async () => {
    const nonExistentUser = userTestFactory.create();

    try {
      await findUserQueryHandler.execute({ userId: nonExistentUser.getId() });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceNotFoundError);

      return;
    }

    expect.fail();
  });
});
