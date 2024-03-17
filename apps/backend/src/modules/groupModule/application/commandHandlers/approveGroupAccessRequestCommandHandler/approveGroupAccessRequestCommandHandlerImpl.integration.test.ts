import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type ApproveGroupAccessRequestCommandHandler } from './approveGroupAccessRequestCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type UserGroupTestUtils } from '../../../../userGroupModule/tests/utils/userGroupTestUtils/userGroupTestUtils.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { symbols } from '../../../symbols.js';
import { type GroupAccessRequestTestUtils } from '../../../tests/utils/groupAccessRequestTestUtils/groupAccessRequestTestUtils.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';

describe('ApproveGroupAccessRequestCommandHandler', () => {
  let commandHandler: ApproveGroupAccessRequestCommandHandler;

  let groupAccessRequestTestUtils: GroupAccessRequestTestUtils;

  let userTestUtils: UserTestUtils;

  let groupTestUtils: GroupTestUtils;

  let userGroupTestUtils: UserGroupTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    commandHandler = container.get<ApproveGroupAccessRequestCommandHandler>(
      symbols.approveGroupAccessRequestCommandHandler,
    );

    groupAccessRequestTestUtils = container.get<GroupAccessRequestTestUtils>(testSymbols.groupAccessRequestTestUtils);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);

    userGroupTestUtils = container.get<UserGroupTestUtils>(testSymbols.userGroupTestUtils);

    await groupAccessRequestTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();

    await userGroupTestUtils.truncate();
  });

  afterEach(async () => {
    await groupAccessRequestTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();

    await userGroupTestUtils.truncate();
  });

  it('throws an error - when GroupAccessRequest does not exist', async () => {
    const invalidUuid = Generator.uuid();

    await expect(async () => {
      await commandHandler.execute({ requestId: invalidUuid });
    }).toThrowErrorInstance({
      instance: ResourceNotFoundError,
      context: {
        name: 'GroupAccessRequest',
        id: invalidUuid,
      },
    });
  });

  it('approves the GroupAccessRequest', async () => {
    const user = await userTestUtils.createAndPersist();

    const group = await groupTestUtils.createAndPersist();

    const groupAccessRequest = await groupAccessRequestTestUtils.createAndPersist({
      input: {
        userId: user.id,
        groupId: group.id,
      },
    });

    await commandHandler.execute({ requestId: groupAccessRequest.id });

    const foundGroupAccessRequest = await groupAccessRequestTestUtils.findById(groupAccessRequest.id);

    expect(foundGroupAccessRequest).toBeNull();

    const userGroup = await userGroupTestUtils.findByUserAndGroup({
      groupId: group.id,
      userId: user.id,
    });

    expect(userGroup).toBeDefined();
  });
});
