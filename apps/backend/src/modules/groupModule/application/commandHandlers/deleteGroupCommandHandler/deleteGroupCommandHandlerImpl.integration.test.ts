import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type DeleteGroupCommandHandler } from './deleteGroupCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { symbols } from '../../../symbols.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';

describe('DeleteGroupCommandHandler', () => {
  let commandHandler: DeleteGroupCommandHandler;

  let groupTestUtils: GroupTestUtils;

  beforeEach(() => {
    const container = TestContainer.create();

    commandHandler = container.get<DeleteGroupCommandHandler>(symbols.deleteGroupCommandHandler);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);
  });

  afterEach(async () => {
    await groupTestUtils.truncate();

    await groupTestUtils.destroyDatabaseConnection();
  });

  it('throws an error - when Group does not exist', async () => {
    const invalidUuid = Generator.uuid();

    await expect(async () => {
      await commandHandler.execute({
        id: invalidUuid,
      });
    }).toThrowErrorInstance({
      instance: ResourceNotFoundError,
      context: {
        name: 'Group',
        id: invalidUuid,
      },
    });
  });

  it('deletes the Group', async () => {
    const group = await groupTestUtils.createAndPersist();

    await commandHandler.execute({
      id: group.id,
    });

    const foundGroup = await groupTestUtils.findById(group.id);

    expect(foundGroup).toBeNull();
  });
});
