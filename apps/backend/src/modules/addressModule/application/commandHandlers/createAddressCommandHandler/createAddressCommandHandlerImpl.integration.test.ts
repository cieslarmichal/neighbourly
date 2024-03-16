import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type CreateAddressCommandHandler } from './createAddressCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { symbols } from '../../../symbols.js';
import { type AddressTestUtils } from '../../../tests/utils/addressTestUtils/addressTestUtils.js';

describe('UpdateAddressCommandHandlerImpl', () => {
  let commandHandler: CreateAddressCommandHandler;

  let addressTestUtils: AddressTestUtils;

  let userTestUtils: UserTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    commandHandler = container.get<CreateAddressCommandHandler>(symbols.createAddressCommandHandler);

    addressTestUtils = container.get<AddressTestUtils>(testSymbols.addressTestUtils);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    await addressTestUtils.truncate();

    await userTestUtils.truncate();
  });

  afterEach(async () => {
    await addressTestUtils.truncate();

    await userTestUtils.truncate();

    await addressTestUtils.destroy();
  });

  it('throws an error - when neither user nor groupId have been provided', async () => {
    await expect(
      async () =>
        await commandHandler.execute({
          groupId: undefined,
          userId: undefined,
          latitude: Generator.number(1, 90),
          longitude: Generator.number(1, 90),
        }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'Group or user id is required.',
      },
    });
  });

  it('returns created Address', async () => {
    const user = await userTestUtils.createAndPersist();

    const latitude = Generator.number(1, 90);

    const longitude = Generator.number(1, 90);

    const foundAddress = await commandHandler.execute({
      groupId: undefined,
      userId: user.id,
      latitude,
      longitude,
    });

    expect(foundAddress.getUserId()).toEqual(user.id);

    expect(foundAddress.getLatitude()).toEqual(latitude);

    expect(foundAddress.getLongitude()).toEqual(longitude);
  });

  it('throws an error - when User was not found', async () => {
    const nonExistentUserId = Generator.uuid();

    await expect(
      async () =>
        await commandHandler.execute({
          groupId: undefined,
          userId: nonExistentUserId,
          latitude: Generator.number(1, 90),
          longitude: Generator.number(1, 90),
        }),
    ).toThrowErrorInstance({
      instance: ResourceNotFoundError,
      context: {
        name: 'User',
        id: nonExistentUserId,
      },
    });
  });

  it('throws an error - when Group does not exist', async () => {
    const nonExistentGroupId = Generator.uuid();

    await expect(
      async () =>
        await commandHandler.execute({
          groupId: nonExistentGroupId,
          userId: undefined,
          latitude: Generator.number(1, 90),
          longitude: Generator.number(1, 90),
        }),
    ).toThrowErrorInstance({
      instance: ResourceNotFoundError,
      context: {
        name: 'Group',
        id: nonExistentGroupId,
      },
    });
  });
});
