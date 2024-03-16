import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type FindGroupByIdQueryHandler } from './findGroupByIdQueryHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { symbols } from '../../../symbols.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';

describe('FindGroupByIdQueryHandlerImpl', () => {
  let queryHandler: FindGroupByIdQueryHandler;

  let groupTestUtils: GroupTestUtils;

  beforeEach(() => {
    const container = TestContainer.create();

    queryHandler = container.get<FindGroupByIdQueryHandler>(symbols.findGroupByIdQueryHandler);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);
  });

  afterEach(async () => {
    await groupTestUtils.truncate();

    await groupTestUtils.destroyDatabaseConnection();
  });

  it('throws an error - when Group was not found', async () => {
    const invalidUuid = Generator.uuid();

    await expect(async () =>
      queryHandler.execute({
        id: invalidUuid,
      }),
    ).toThrowErrorInstance({
      instance: ResourceNotFoundError,
      context: {
        name: 'Group',
        id: invalidUuid,
      },
    });
  });

  it('returns the Group', async () => {
    const group = await groupTestUtils.createAndPersist();

    const result = await queryHandler.execute({
      id: group.id,
    });

    expect(result.group.getId()).toEqual(group.id);
  });
});
