import { type UpdateAddressCommandHandler, type UpdateAddressPayload } from './updateAddressCommandHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type Address } from '../../../domain/entities/address/address.js';
import { type AddressRepository } from '../../../domain/repositories/addressRepository/addressRepository.js';

export class UpdateAddressCommandHandlerImpl implements UpdateAddressCommandHandler {
  public constructor(private readonly addressRepository: AddressRepository) {}

  public async execute(payload: UpdateAddressPayload): Promise<Address> {
    const { id, latitude, longitude } = payload;

    const addressExists = await this.addressRepository.findById({
      id,
    });

    if (!addressExists) {
      throw new ResourceNotFoundError({
        name: 'Address',
        id,
      });
    }

    return await this.addressRepository.update({
      id,
      latitude,
      longitude,
    });
  }
}
