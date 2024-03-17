import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type RequestGroupAccessCommandHandler } from './requestGroupAccessRequestCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { symbols } from '../../../symbols.js';
import { type GroupAccessRequestTestUtils } from '../../../tests/utils/groupAccessRequestTestUtils/groupAccessRequestTestUtils.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';

describe('RequestGroupAccessCommandHandlerImpl', () => {
  let commandHandler: RequestGroupAccessCommandHandler;

  let groupAccessRequestTestUtils: GroupAccessRequestTestUtils;

  let userTestUtils: UserTestUtils;

  let groupTestUtils: GroupTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    commandHandler = container.get<RequestGroupAccessCommandHandler>(symbols.requestGroupAccessCommandHandler);

    groupAccessRequestTestUtils = container.get<GroupAccessRequestTestUtils>(testSymbols.groupAccessRequestTestUtils);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);

    await groupAccessRequestTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();
  });

  afterEach(async () => {
    await groupAccessRequestTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();
  });

  it('creates GroupAccessRequest', async () => {
    const user = await userTestUtils.createAndPersist();

    const group = await groupTestUtils.createAndPersist();

    const { groupAccessRequest } = await commandHandler.execute({
      groupId: group.id,
      userId: user.id,
    });

    expect(groupAccessRequest.getState()).toEqual({
      groupId: group.id,
      userId: user.id,
    });

    const persistedGroupAccessRequest = await groupAccessRequestTestUtils.findById(groupAccessRequest.getId());

    expect(persistedGroupAccessRequest).not.toBeNull();
  });

  it('throws error - when User was not found', async () => {
    const group = await groupTestUtils.createAndPersist();

    await expect(async () => {
      await commandHandler.execute({
        groupId: group.id,
        userId: Generator.uuid(),
      });
    }).toThrowErrorInstance({
      instance: OperationNotValidError,
    });
  });

  it('throws error - when Group was not found', async () => {
    const user = await userTestUtils.createAndPersist();

    await expect(async () => {
      await commandHandler.execute({
        groupId: Generator.uuid(),
        userId: user.id,
      });
    }).toThrowErrorInstance({
      instance: OperationNotValidError,
    });
  });
});
