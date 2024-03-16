import { Address } from '../../domain/entities/address/address.js';
import { type AddressMapper } from '../../domain/mapper/addressMapper.js';
import { type AddressTableRawTransformedEntity } from '../databases/addressDatabase/tables/addressTable/addressTableRawEntity.js';

export class AddressMapperImpl implements AddressMapper {
  public toDomain(raw: AddressTableRawTransformedEntity): Address {
    return new Address({
      id: raw.id,
      state: {
        id: raw.id,
        latitude: raw.latitude,
        longitude: raw.longitude,
        userId: raw.userId ?? null,
        groupId: raw.groupId ?? null,
      },
    });
  }
}
