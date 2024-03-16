import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type RawQuery } from '../../../../../libs/database/types/rawQuery.js';
import { type Address } from '../../../domain/entities/address/address.js';
import { type AddressState } from '../../../domain/entities/address/addressState.js';
import { addressTable } from '../../../infrastructure/databases/addressDatabase/tables/addressTable/addressTable.js';
import { type AddressTableRawEntity } from '../../../infrastructure/databases/addressDatabase/tables/addressTable/addressTableRawEntity.js';
import { AddressTestFactory } from '../../factories/addressTestFactory/addressTestFactory.js';

interface CreateAndPersistsPayload {
  input?: {
    id?: string;
    state?: Partial<AddressState>;
  };
}

export class AddressTestUtils {
  private readonly addressTestFactory = AddressTestFactory.createFactory();

  public constructor(private readonly databaseClient: DatabaseClient) {}

  public async createAndPersist(payload: CreateAndPersistsPayload = { input: {} }): Promise<Address> {
    const address = this.addressTestFactory.createAddress({
      id: payload.input?.id as string,
      state: payload.input?.state as AddressState,
    });

    await this.databaseClient(addressTable).insert(<AddressTableRawEntity>{
      id: address.getId(),
      point: this.databaseClient.raw(`ST_GeomFromText('POINT(' || ? || ' ' || ? || ')', 4326)`, [
        address.getLatitude(),
        address.getLongitude(),
      ]) as unknown as string,
      groupId: address.getGroupId(),
      userId: address.getUserId(),
      city: address.getCity(),
      postalCode: address.getPostalCode(),
      street: address.getStreet(),
    });

    return this.addressTestFactory.createAddress({
      id: address.getId(),
      state: {
        latitude: address.getLatitude(),
        longitude: address.getLongitude(),
        groupId: address.getGroupId(),
        userId: address.getUserId(),
        city: address.getCity(),
        postalCode: address.getPostalCode(),
        street: address.getStreet(),
      },
    });
  }

  public async findById(id: string): Promise<Address | null> {
    const result = await this.databaseClient(addressTable).where('id', id).select(this.prepareSelectors()).first();

    if (result.length === 0) {
      return null;
    }

    return this.addressTestFactory.createAddress({
      id: result.id,
      state: {
        latitude: result.latitude,
        longitude: result.longitude,
        groupId: result.groupId,
        userId: result.userId,
        city: result.city,
        postalCode: result.postalCode,
        street: result.street,
      },
    });
  }

  public async truncate(): Promise<void> {
    await this.databaseClient(addressTable).truncate();
  }

  public async destroy(): Promise<void> {
    await this.databaseClient.destroy();
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
