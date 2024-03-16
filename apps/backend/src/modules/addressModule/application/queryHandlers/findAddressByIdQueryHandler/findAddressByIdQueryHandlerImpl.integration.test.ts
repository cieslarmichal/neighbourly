import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type FindAddressByIdQueryHandler } from './findAddressByIdQueryHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { symbols } from '../../../symbols.js';
import { type AddressTestUtils } from '../../../tests/utils/addressTestUtils/addressTestUtils.js';

describe('FindAddressByIdQueryHandlerImpl', () => {
  let queryHandler: FindAddressByIdQueryHandler;

  let addressTestUtils: AddressTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    queryHandler = container.get<FindAddressByIdQueryHandler>(symbols.findAddressByIdQueryHandler);

    addressTestUtils = container.get<AddressTestUtils>(testSymbols.addressTestUtils);

    await addressTestUtils.truncate();
  });

  afterEach(async () => {
    await addressTestUtils.truncate();

    await addressTestUtils.destroy();
  });

  it('throws an error - when Address was not found', async () => {
    const nonExistentAddressId = Generator.uuid();

    await expect(
      async () =>
        await queryHandler.execute({
          id: nonExistentAddressId,
        }),
    ).toThrowErrorInstance({
      instance: ResourceNotFoundError,
      context: {
        name: 'Address',
        id: nonExistentAddressId,
      },
    });
  });

  it('returns an Address', async () => {
    const address = await addressTestUtils.createAndPersist();

    const foundAddress = await queryHandler.execute({
      id: address.getId(),
    });

    expect(foundAddress).toEqual(address);
  });
});
