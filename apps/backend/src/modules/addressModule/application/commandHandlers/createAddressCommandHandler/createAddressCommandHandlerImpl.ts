import {
  type CreateAddressCommandHandlerPayload,
  type CreateAddressCommandHandler,
} from './createAddressCommandHandler.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type GroupRepository } from '../../../../groupModule/domain/repositories/groupRepository/groupRepository.js';
import { type UserRepository } from '../../../../userModule/domain/repositories/userRepository/userRepository.js';
import { type Address } from '../../../domain/entities/address/address.js';
import {
  type CreatePayload,
  type AddressRepository,
} from '../../../domain/repositories/addressRepository/addressRepository.js';

export class CreateAddressCommandHandlerImpl implements CreateAddressCommandHandler {
  public constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  public async execute(payload: CreateAddressCommandHandlerPayload): Promise<Address> {
    const { groupId, userId, latitude, longitude, city, postalCode, street } = payload;

    if (!groupId && !userId) {
      throw new OperationNotValidError({
        reason: 'Group or user id is required.',
      });
    }

    const createPayload: Partial<CreatePayload> = {
      latitude,
      longitude,
      city,
      postalCode,
      street,
    };

    if (groupId) {
      const groupExists = await this.groupRepository.findGroup({ id: groupId });

      if (!groupExists) {
        throw new ResourceNotFoundError({
          name: 'Group',
          id: groupId,
        });
      }

      createPayload.groupId = groupId;

      return await this.addressRepository.create(createPayload as CreatePayload);
    }

    createPayload.userId = userId as string;

    const userExists = await this.userRepository.findUser({
      id: userId as string,
    });

    if (!userExists) {
      throw new ResourceNotFoundError({
        name: 'User',
        id: userId,
      });
    }

    return await this.addressRepository.create(createPayload as CreatePayload);
  }
}
