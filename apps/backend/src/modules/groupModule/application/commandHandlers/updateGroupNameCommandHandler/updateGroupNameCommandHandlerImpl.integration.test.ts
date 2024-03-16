import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type UpdateGroupNameCommandHandler } from './updateGroupNameCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { symbols } from '../../../symbols.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';

describe('UpdateGroupNameCommandHandler', () => {
  let commandHandler: UpdateGroupNameCommandHandler;

  let groupTestUtils: GroupTestUtils;

  beforeEach(() => {
    const container = TestContainer.create();

    commandHandler = container.get<UpdateGroupNameCommandHandler>(symbols.updateGroupNameCommandHandler);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);
  });

  afterEach(async () => {
    await groupTestUtils.truncate();

    await groupTestUtils.destroyDatabaseConnection();
  });

  it('throws an error - when Group does not exist', async () => {
    const invalidUuid = Generator.uuid();

    await expect(
      async () =>
        await commandHandler.execute({
          id: invalidUuid,
          name: Generator.words(2),
        }),
    ).toThrowErrorInstance({
      instance: ResourceNotFoundError,
      context: {
        name: 'Group',
        id: invalidUuid,
      },
    });
  });

  it('throws an error - when Group with given name already exists', async () => {
    const preExistingGroup = await groupTestUtils.createAndPersist();

    const secondGroup = await groupTestUtils.createAndPersist();

    await expect(
      async () =>
        await commandHandler.execute({
          id: preExistingGroup.id,
          name: secondGroup.name,
        }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'Group with this name already exists.',
        name: secondGroup.name,
      },
    });
  });
});
