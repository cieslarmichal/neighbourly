import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { type UserGroupRole } from '@common/contracts';
import { Generator } from '@common/tests';

import { type CreateUserGroupCommandHandler } from './createUserGroupCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type GroupTestUtils } from '../../../../groupModule/tests/utils/groupTestUtils/groupTestUtils.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { symbols } from '../../../symbols.js';
import { type UserGroupTestUtils } from '../../../tests/utils/userGroupTestUtils/userGroupTestUtils.js';

describe('CreateUserGroupCommandHandler', () => {
  let createUserGroupCommandHandler: CreateUserGroupCommandHandler;

  let databaseClient: DatabaseClient;

  let userGroupTestUtils: UserGroupTestUtils;

  let userTestUtils: UserTestUtils;

  let groupTestUtils: GroupTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    createUserGroupCommandHandler = container.get<CreateUserGroupCommandHandler>(symbols.createUserGroupCommandHandler);

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

  it('creates UserGroup', async () => {
    const user = await userTestUtils.createAndPersist();

    const group = await groupTestUtils.createAndPersist();

    const role = Generator.userGroupRole() as UserGroupRole;

    const { userGroup } = await createUserGroupCommandHandler.execute({
      groupId: group.id,
      userId: user.id,
      role,
    });

    const foundUserGroup = await userGroupTestUtils.findByUserAndGroup({
      groupId: group.id,
      userId: user.id,
    });

    expect(userGroup).toBeDefined();

    expect(foundUserGroup).toBeDefined();
  });

  it('throws an error - when provided User does not exist', async () => {
    const userId = Generator.uuid();

    const group = await groupTestUtils.createAndPersist();

    const role = Generator.userGroupRole() as UserGroupRole;

    await expect(async () =>
      createUserGroupCommandHandler.execute({
        groupId: group.id,
        userId,
        role,
      }),
    ).toThrowErrorInstance({
      instance: ResourceNotFoundError,
      context: {
        name: 'User',
      },
    });
  });

  it('throws an error - when provided Group does not exist', async () => {
    const user = await userTestUtils.createAndPersist();

    const groupId = Generator.uuid();

    const role = Generator.userGroupRole() as UserGroupRole;

    await expect(async () =>
      createUserGroupCommandHandler.execute({
        groupId,
        userId: user.id,
        role,
      }),
    ).toThrowErrorInstance({
      instance: ResourceNotFoundError,
      context: {
        name: 'Group',
      },
    });
  });
});
