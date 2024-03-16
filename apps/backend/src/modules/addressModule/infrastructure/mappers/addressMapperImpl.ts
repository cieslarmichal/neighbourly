import { Address } from '../../domain/entities/address/address.js';
import { type AddressMapper } from '../../domain/mappers/addressMapper.js';
import { type AddressTableRawTransformedEntity } from '../databases/addressDatabase/tables/addressTable/addressTableRawEntity.js';

export class AddressMapperImpl implements AddressMapper {
  public toDomain(raw: AddressTableRawTransformedEntity): Address {
    return new Address({
      id: raw.id,
      state: {
        latitude: raw.latitude,
        longitude: raw.longitude,
        userId: raw.userId ?? null,
        groupId: raw.groupId ?? null,
        city: raw.city,
        postalCode: raw.postalCode,
        street: raw.street,
      },
    });
  }
}
