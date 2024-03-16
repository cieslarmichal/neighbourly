import { Generator } from '@common/tests';

import { Address } from '../../../domain/entities/address/address.js';
import { type AddressState } from '../../../domain/entities/address/addressState.js';

interface CreateAddressPayload {
  id?: string;
  state?: Partial<AddressState>;
}

export class AddressTestFactory {
  private constructor() {}

  public static createFactory(): AddressTestFactory {
    return new AddressTestFactory();
  }

  public createAddress(input: CreateAddressPayload): Address {
    return new Address({
      id: input?.id || Generator.uuid(),
      state: {
        latitude: Generator.number(-90, 90, 6),
        longitude: Generator.number(-180, 180, 6),
        groupId: null,
        userId: null,
        city: Generator.alphaString(10),
        postalCode: Generator.alphaString(10),
        street: Generator.alphaString(10),
        ...input?.state,
      },
    });
  }

  public createAddressState(input: Partial<AddressState>): AddressState {
    return {
      latitude: Generator.number(-90, 90, 6),
      longitude: Generator.number(-180, 180, 6),
      groupId: null,
      userId: null,
      city: Generator.alphaString(10),
      postalCode: Generator.alphaString(10),
      street: Generator.alphaString(10),
      ...input,
    };
  }
}
