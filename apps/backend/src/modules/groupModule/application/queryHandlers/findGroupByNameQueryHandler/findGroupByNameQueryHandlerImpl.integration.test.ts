import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { type FindGroupByNameQueryHandler } from './findGroupByNameQueryHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { symbols } from '../../../symbols.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';

describe('FindGroupByNameQueryHandlerImpl', () => {
  let queryHandler: FindGroupByNameQueryHandler;

  let groupTestUtils: GroupTestUtils;

  beforeEach(() => {
    const container = TestContainer.create();

    queryHandler = container.get<FindGroupByNameQueryHandler>(symbols.findGroupByNameQueryHandler);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);
  });

  afterEach(async () => {
    await groupTestUtils.truncate();

    await groupTestUtils.destroyDatabaseConnection();
  });

  it('throws an error - when Group does not exist', async () => {
    const invalidName = 'invalidName';

    await expect(
      async () =>
        await queryHandler.execute({
          name: invalidName,
        }),
    ).toThrowErrorInstance({
      instance: ResourceNotFoundError,
      context: {
        name: 'Group',
        groupName: invalidName,
      },
    });
  });

  it('returns Group - when Group exists', async () => {
    const group = await groupTestUtils.createAndPersist();

    const result = await queryHandler.execute({
      name: group.name,
    });

    expect(result.group.getId()).toEqual(group.id);
  });
});
