import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type UpdateAddressCommandHandler } from './updateAddressCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { symbols } from '../../../symbols.js';
import { type AddressTestUtils } from '../../../tests/utils/addressTestUtils/addressTestUtils.js';

describe('UpdateAddressCommandHandlerImpl', () => {
  let commandHandler: UpdateAddressCommandHandler;

  let addressTestUtils: AddressTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    commandHandler = container.get<UpdateAddressCommandHandler>(symbols.updateAddressCommandHandler);

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
        await commandHandler.execute({
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

  it('returns updated Address', async () => {
    const address = await addressTestUtils.createAndPersist();

    const foundAddress = await commandHandler.execute({
      id: address.getId(),
      latitude: 55,
    });

    expect(foundAddress.getLatitude()).toEqual(55);
  });
});
