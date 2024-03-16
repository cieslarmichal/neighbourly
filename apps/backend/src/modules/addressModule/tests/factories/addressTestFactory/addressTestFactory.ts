import { Generator } from '@common/tests';

import { Address, type AddressProps } from '../../../domain/entities/address/address.js';

export class AddressTestFactory {
  private constructor() {}

  public static createFactory(): AddressTestFactory {
    return new AddressTestFactory();
  }

  public createAddress(input: Partial<AddressProps>): Address {
    return new Address({
      id: input.id || Generator.uuid(),
      state: {
        latitude: Generator.number(-90, 90, 6),
        longitude: Generator.number(-180, 180, 6),
        groupId: null,
        userId: null,
        ...input.state,
      },
    });
  }

  public createAddressState(input: Partial<AddressProps['state']>): AddressProps['state'] {
    return {
      latitude: Generator.number(-90, 90, 6),
      longitude: Generator.number(-180, 180, 6),
      groupId: null,
      userId: null,
      ...input,
    };
  }
}
