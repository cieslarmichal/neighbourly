import { RepositoryError } from '../../../../../common/errors/repositoryError.js';
import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type RawQuery } from '../../../../../libs/database/types/rawQuery.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { type Address } from '../../../domain/entities/address/address.js';
import { type AddressMapper } from '../../../domain/mappers/addressMapper.js';
import {
  type AddressRepository,
  type FindByIdPayload,
  type UpdatePayload,
  type CreatePayload,
} from '../../../domain/repositories/addressRepository/addressRepository.js';
import { addressTable } from '../../databases/addressDatabase/tables/addressTable/addressTable.js';
import {
  type AddressTableRawEntity,
  type AddressTableRawTransformedEntity,
} from '../../databases/addressDatabase/tables/addressTable/addressTableRawEntity.js';

export class AddressRepositoryImpl implements AddressRepository {
  public constructor(
    private readonly databaseClient: DatabaseClient,
    private readonly addressMapper: AddressMapper,
    private readonly uuidService: UuidService,
  ) {}

  public async findById(payload: FindByIdPayload): Promise<Address | null> {
    const { id } = payload;

    let rawEntity: AddressTableRawTransformedEntity;

    try {
      rawEntity = await this.databaseClient(addressTable).select(this.prepareSelectors()).where('id', id).first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'Address',
        operation: 'findById',
        error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.addressMapper.toDomain(rawEntity);
  }

  public async create(payload: CreatePayload): Promise<Address> {
    const { groupId, latitude, longitude, userId, city, postalCode, street } = payload;

    let rawEntity: AddressTableRawTransformedEntity;

    try {
      const created = await this.databaseClient(addressTable)
        .insert<AddressTableRawEntity>({
          id: this.uuidService.generateUuid(),
          point: this.databaseClient.raw(`ST_GeomFromText('POINT(' || ? || ' ' || ? || ')', 4326)`, [
            latitude,
            longitude,
          ]),
          ...(groupId ? { groupId } : { userId }),
          city,
          postalCode,
          street,
        })
        .returning('*');

      rawEntity = await this.databaseClient
        .select(this.prepareSelectors())
        .from(addressTable)
        .where('id', created[0].id)
        .first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'Address',
        operation: 'create',
        error,
      });
    }

    return this.addressMapper.toDomain(rawEntity);
  }

  public async update(payload: UpdatePayload): Promise<Address> {
    const { latitude, longitude, id } = payload;

    const updatePayload: Partial<AddressTableRawEntity> = {};

    let rawEntity: AddressTableRawTransformedEntity;

    if (latitude && longitude) {
      updatePayload.point = this.databaseClient.raw(`ST_GeomFromText('POINT(' || ? || ' ' || ? || ')', 4326)`, [
        latitude,
        longitude,
      ]) as unknown as string;
    }

    if (latitude && !longitude) {
      rawEntity = await this.databaseClient(addressTable).select(this.prepareSelectors()).where('id', id).first();

      if (!rawEntity) {
        throw new RepositoryError({
          entity: 'Address',
          operation: 'update',
          error: new Error('Address not found'),
        });
      }

      updatePayload.point = this.databaseClient.raw(`ST_GeomFromText('POINT(' || ? || ' ' || ? || ')', 4326)`, [
        latitude,
        rawEntity.longitude,
      ]) as unknown as string;
    }

    if (longitude && !latitude) {
      rawEntity = await this.databaseClient(addressTable).select(this.prepareSelectors()).where('id', id).first();

      if (!rawEntity) {
        throw new RepositoryError({
          entity: 'Address',
          operation: 'update',
          error: new Error('Address not found'),
        });
      }

      updatePayload.point = this.databaseClient.raw(`ST_GeomFromText('POINT(' || ? || ' ' || ? || ')', 4326)`, [
        rawEntity.latitude,
        longitude,
      ]) as unknown as string;
    }

    try {
      await this.databaseClient(addressTable).update(updatePayload).where('id', id);

      rawEntity = await this.databaseClient(addressTable).select(this.prepareSelectors()).where('id', id).first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'Address',
        operation: 'update',
        error,
      });
    }

    return this.addressMapper.toDomain(rawEntity);
  }

  private prepareSelectors(): (string | RawQuery)[] {
    return [
      'id',
      'groupId',
      'userId',
      'street',
      'city',
      'postalCode',
      this.databaseClient.raw('ST_X(point) as latitude'),
      this.databaseClient.raw('ST_Y(point) as longitude'),
    ];
  }
}
