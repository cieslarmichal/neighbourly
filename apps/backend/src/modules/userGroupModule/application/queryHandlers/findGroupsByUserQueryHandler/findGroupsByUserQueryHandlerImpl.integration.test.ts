import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { type FindGroupsByUserQueryHandler } from './findGroupsByUserQueryHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type GroupTestUtils } from '../../../../groupModule/tests/utils/groupTestUtils/groupTestUtils.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { symbols } from '../../../symbols.js';
import { type UserGroupTestUtils } from '../../../tests/utils/userGroupTestUtils/userGroupTestUtils.js';

describe('FindGroupsByUserQueryHandlerImpl', () => {
  let queryHandler: FindGroupsByUserQueryHandler;

  let databaseClient: DatabaseClient;

  let userGroupTestUtils: UserGroupTestUtils;

  let userTestUtils: UserTestUtils;

  let groupTestUtils: GroupTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    queryHandler = container.get<FindGroupsByUserQueryHandler>(symbols.findGroupsByUserQueryHandler);

    databaseClient = container.get<DatabaseClient>(coreSymbols.databaseClient);

    userGroupTestUtils = container.get<UserGroupTestUtils>(testSymbols.userGroupTestUtils);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);

    await userGroupTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();
  });

  afterEach(async () => {
    await userGroupTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();

    await databaseClient.destroy();
  });

  describe('findUserGroups', () => {
    it('returns Groups by user id', async () => {
      const user1 = await userTestUtils.createAndPersist();

      const user2 = await userTestUtils.createAndPersist();

      const group1 = await groupTestUtils.createAndPersist();

      const group2 = await groupTestUtils.createAndPersist();

      await userGroupTestUtils.createAndPersist({
        input: {
          userId: user1.id,
          groupId: group1.id,
        },
      });

      await userGroupTestUtils.createAndPersist({
        input: {
          userId: user2.id,
          groupId: group2.id,
        },
      });

      const { groups } = await queryHandler.execute({ userId: user1.id });

      expect(groups.length).toEqual(1);

      expect(groups[0]?.getId()).toEqual(group1.id);
    });
  });
});
