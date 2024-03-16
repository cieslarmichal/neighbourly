import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { type AddressRepository } from '../../../domain/repositories/addressRepository/addressRepository.js';
import { symbols } from '../../../symbols.js';
import { AddressTestFactory } from '../../../tests/factories/addressTestFactory/addressTestFactory.js';
import { type AddressTestUtils } from '../../../tests/utils/addressTestUtils/addressTestUtils.js';

describe('AddressRepositoryImpl', () => {
  let repository: AddressRepository;

  let addressTestUtils: AddressTestUtils;

  const addressTestFactory = AddressTestFactory.createFactory();

  beforeEach(async () => {
    const container = TestContainer.create();

    repository = container.get<AddressRepository>(symbols.addressRepository);

    addressTestUtils = container.get<AddressTestUtils>(testSymbols.addressTestUtils);

    await addressTestUtils.truncate();
  });

  afterEach(async () => {
    await addressTestUtils.truncate();

    await addressTestUtils.destroy();
  });

  describe('findById', () => {
    it('returns null - when no Address was found', async () => {
      const nonExistentId = Generator.uuid();

      const result = await repository.findById({
        id: nonExistentId,
      });

      expect(result).toBeNull();
    });

    it('returns the Address', async () => {
      const address = await addressTestUtils.createAndPersist();

      const result = await repository.findById({
        id: address.getId(),
      });

      expect(result).toEqual(address);
    });
  });

  describe('create', () => {
    it('creates the Address', async () => {
      const addressState = addressTestFactory.createAddressState({});

      const address = await repository.create({
        groupId: addressState.groupId,
        latitude: addressState.latitude,
        longitude: addressState.longitude,
        userId: addressState.userId,
        city: addressState.city,
        postalCode: addressState.postalCode,
        street: addressState.street,
      });

      expect(address.getLatitude()).toBe(addressState.latitude);

      expect(address.getLongitude()).toBe(addressState.longitude);

      const result = await addressTestUtils.findById(address.getId());

      expect(result).toEqual(address);
    });
  });

  describe('update', () => {
    it('updates latitude', async () => {
      const newLatitude = Generator.number(-90, 90, 6);

      const address = await addressTestUtils.createAndPersist();

      const updatedAddress = await repository.update({
        id: address.getId(),
        latitude: newLatitude,
      });

      expect(updatedAddress.getLatitude()).toBe(newLatitude);

      const result = await addressTestUtils.findById(address.getId());

      expect(result).toEqual(updatedAddress);
    });
  });

  it('update longitude', async () => {
    const newLongitude = Generator.number(-180, 180, 6);

    const address = await addressTestUtils.createAndPersist();

    const updatedAddress = await repository.update({
      id: address.getId(),
      longitude: newLongitude,
    });

    expect(updatedAddress.getLongitude()).toBe(newLongitude);

    const result = await addressTestUtils.findById(address.getId());

    expect(result).toEqual(updatedAddress);
  });

  it('updates latitude and longitude', async () => {
    const newLatitude = Generator.number(-90, 90, 6);

    const newLongitude = Generator.number(-180, 180, 6);

    const address = await addressTestUtils.createAndPersist();

    const updatedAddress = await repository.update({
      id: address.getId(),
      latitude: newLatitude,
      longitude: newLongitude,
    });

    expect(updatedAddress.getLatitude()).toBe(newLatitude);

    expect(updatedAddress.getLongitude()).toBe(newLongitude);

    const result = await addressTestUtils.findById(address.getId());

    expect(result).toEqual(updatedAddress);
  });
});
