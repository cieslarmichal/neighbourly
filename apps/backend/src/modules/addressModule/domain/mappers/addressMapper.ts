import { type AddressTableRawTransformedEntity } from '../../infrastructure/databases/addressDatabase/tables/addressTable/addressTableRawEntity.js';
import { type Address } from '../entities/address/address.js';

export interface AddressMapper {
  toDomain(raw: AddressTableRawTransformedEntity): Address;
}
