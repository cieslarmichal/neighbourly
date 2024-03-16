import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '@common/tests';

import { type DeleteUserGroupCommandHandler } from './deleteUserGroupCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type GroupTestUtils } from '../../../../groupModule/tests/utils/groupTestUtils/groupTestUtils.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { symbols } from '../../../symbols.js';
import { type UserGroupTestUtils } from '../../../tests/utils/userGroupTestUtils/userGroupTestUtils.js';

describe('DeleteUserGroupCommandHandler', () => {
  let deleteUserGroupCommandHandler: DeleteUserGroupCommandHandler;

  let databaseClient: DatabaseClient;

  let userGroupTestUtils: UserGroupTestUtils;

  let userTestUtils: UserTestUtils;

  let groupTestUtils: GroupTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    deleteUserGroupCommandHandler = container.get<DeleteUserGroupCommandHandler>(symbols.deleteUserGroupCommandHandler);

    databaseClient = container.get<DatabaseClient>(coreSymbols.databaseClient);

    userGroupTestUtils = container.get<UserGroupTestUtils>(testSymbols.userGroupTestUtils);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);

    await userGroupTestUtils.truncate();

    await groupTestUtils.truncate();

    await userTestUtils.truncate();
  });

  afterEach(async () => {
    await userGroupTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();

    await databaseClient.destroy();
  });

  it('deletes UserGroup', async () => {
    const user = await userTestUtils.createAndPersist();

    const group = await groupTestUtils.createAndPersist();

    await userGroupTestUtils.createAndPersist({
      input: {
        groupId: group.id,
        userId: user.id,
      },
    });

    await deleteUserGroupCommandHandler.execute({
      groupId: group.id,
      userId: user.id,
    });

    const foundUserGroup = await userGroupTestUtils.findByUserAndGroup({
      groupId: group.id,
      userId: user.id,
    });

    expect(foundUserGroup).toBeUndefined();
  });

  it('throws an error if UserGroup does not exist', async () => {
    const groupId = Generator.uuid();

    const userId = Generator.uuid();

    await expect(async () =>
      deleteUserGroupCommandHandler.execute({
        groupId,
        userId,
      }),
    ).toThrowErrorInstance({
      instance: ResourceNotFoundError,
      context: {
        name: 'UserGroup',
      },
    });
  });
});
