import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { type AccessType } from '@common/contracts';
import { Generator } from '@common/tests';

import { type UpdateGroupCommandHandler } from './updateGroupCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { symbols } from '../../../symbols.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';

describe('UpdateGroupCommandHandler', () => {
  let commandHandler: UpdateGroupCommandHandler;

  let groupTestUtils: GroupTestUtils;

  beforeEach(() => {
    const container = TestContainer.create();

    commandHandler = container.get<UpdateGroupCommandHandler>(symbols.updateGroupCommandHandler);

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

  it('updates Group name', async () => {
    const group = await groupTestUtils.createAndPersist();

    const newName = Generator.words(2);

    const { group: updatedGroup } = await commandHandler.execute({
      id: group.id,
      name: newName,
    });

    expect(updatedGroup.getId()).toEqual(group.id);

    expect(updatedGroup.getName()).toEqual(newName);
  });

  it('updates Group accessType', async () => {
    const group = await groupTestUtils.createAndPersist();

    const newAccessType = Generator.accessType() as AccessType;

    const { group: updatedGroup } = await commandHandler.execute({
      id: group.id,
      accessType: newAccessType,
    });

    expect(updatedGroup.getId()).toEqual(group.id);

    expect(updatedGroup.getAccessType()).toEqual(newAccessType);
  });
});
