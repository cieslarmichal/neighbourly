import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { UserGroupRole } from '@common/contracts';
import { Generator } from '@common/tests';

import { type UpdateUserGroupCommandHandler } from './updateUserGroupCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type GroupTestUtils } from '../../../../groupModule/tests/utils/groupTestUtils/groupTestUtils.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { symbols } from '../../../symbols.js';
import { type UserGroupTestUtils } from '../../../tests/utils/userGroupTestUtils/userGroupTestUtils.js';

describe('UpdateUserGroupCommandHandlerImpl', () => {
  let commandHandler: UpdateUserGroupCommandHandler;

  let groupTestUtils: GroupTestUtils;

  let userGroupTestUtils: UserGroupTestUtils;

  let userTestUtils: UserTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    commandHandler = container.get<UpdateUserGroupCommandHandler>(symbols.updateUserGroupCommandHandler);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);

    userGroupTestUtils = container.get<UserGroupTestUtils>(testSymbols.userGroupTestUtils);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    await groupTestUtils.truncate();

    await userGroupTestUtils.truncate();

    await userTestUtils.truncate();
  });

  afterEach(async () => {
    await groupTestUtils.truncate();

    await userGroupTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.destroyDatabaseConnection();
  });

  it('throws an error - when UserGroup does not exist', async () => {
    const userId = Generator.uuid();

    const groupId = Generator.uuid();

    await expect(async () =>
      commandHandler.execute({
        groupId,
        userId,
        role: UserGroupRole.admin,
      }),
    ).toThrowErrorInstance({
      instance: ResourceNotFoundError,
      message: 'Resource not found.',
      context: {
        name: 'UserGroup',
        groupId,
        userId,
      },
    });
  });

  it('updates UserGroup role', async () => {
    const user = await userTestUtils.createAndPersist();

    const group = await groupTestUtils.createAndPersist();

    await userGroupTestUtils.createAndPersist({
      input: {
        userId: user.id,
        groupId: group.id,
      },
    });

    const updatedRole = Generator.userGroupRole() as UserGroupRole;

    const { userGroup: updatedUserGroup } = await commandHandler.execute({
      groupId: group.id,
      userId: user.id,
      role: updatedRole,
    });

    const foundUserGroup = await userGroupTestUtils.findByUserAndGroup({
      userId: user.id,
      groupId: group.id,
    });

    expect(updatedUserGroup.getRole()).toEqual(updatedRole);

    expect(foundUserGroup?.role).toEqual(updatedRole);
  });
});
