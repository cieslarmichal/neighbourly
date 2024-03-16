import { type FindAddressByIdPayload, type FindAddressByIdQueryHandler } from './findAddressByIdQueryHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type Address } from '../../../domain/entities/address/address.js';
import { type AddressRepository } from '../../../domain/repositories/addressRepository/addressRepository.js';

export class FindAddressByIdQueryHandlerImpl implements FindAddressByIdQueryHandler {
  public constructor(private readonly addressRepository: AddressRepository) {}

  public async execute(payload: FindAddressByIdPayload): Promise<Address> {
    const { id } = payload;

    const address = await this.addressRepository.findById({ id });

    if (!address) {
      throw new ResourceNotFoundError({
        name: 'Address',
        id,
      });
    }

    return address;
  }
}
