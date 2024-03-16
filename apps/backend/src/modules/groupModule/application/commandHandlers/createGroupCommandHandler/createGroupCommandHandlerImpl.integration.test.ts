import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { type AccessType } from '@common/contracts';
import { Generator } from '@common/tests';

import { type CreateGroupCommandHandler } from './createGroupCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { symbols } from '../../../symbols.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';

describe('CreateGroupCommandHandlerImpl', () => {
  let commandHandler: CreateGroupCommandHandler;

  let groupTestUtils: GroupTestUtils;

  beforeEach(() => {
    const container = TestContainer.create();

    commandHandler = container.get<CreateGroupCommandHandler>(symbols.createGroupCommandHandler);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);
  });

  afterEach(async () => {
    await groupTestUtils.truncate();

    await groupTestUtils.destroyDatabaseConnection();
  });

  it('throws an error - when Group already exists', async () => {
    const group = await groupTestUtils.createAndPersist();

    await expect(
      async () =>
        await commandHandler.execute({
          name: group.name,
          accessType: group.accessType,
        }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'Group already exists.',
        name: group.name,
      },
    });
  });

  it('creates Group', async () => {
    const groupName = Generator.words(2);

    const accessType = Generator.accessType() as AccessType;

    const { group } = await commandHandler.execute({
      name: groupName,
      accessType,
    });

    expect(group.getName()).toEqual(groupName);

    const persistedGroup = await groupTestUtils.findByName(groupName);

    expect(persistedGroup).not.toBeNull();

    expect(persistedGroup?.id).toEqual(group.getId());

    expect(persistedGroup?.name).toEqual(group.getName());
  });
});
