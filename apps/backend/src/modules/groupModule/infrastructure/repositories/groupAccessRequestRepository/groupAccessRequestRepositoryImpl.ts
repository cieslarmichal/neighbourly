import { type GroupAccessRequestMapper } from './groupAccessRequestMapper/groupAccessRequestMapper.js';
import { RepositoryError } from '../../../../../common/errors/repositoryError.js';
import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { type GroupAccessRequest } from '../../../domain/entities/groupAccessRequest/groupAccessRequest.js';
import {
  type FindGroupAccessRequestPayload,
  type GroupAccessRequestRepository,
  type FindGroupAccessRequests,
  type SaveGroupAccessRequestPayload,
  type DeleteGroupAccessRequestPayload,
} from '../../../domain/repositories/groupAccessRequestRepository/groupAccessRequestRepository.js';
import { type GroupAccessRequestRawEntity } from '../../databases/groupDatabase/tables/groupAccessRequestTable/groupAccessRequestRawEntity.js';
import { groupAccessRequestTable } from '../../databases/groupDatabase/tables/groupAccessRequestTable/groupAccessRequestTable.js';

export class GroupAccessRequestRepositoryImpl implements GroupAccessRequestRepository {
  public constructor(
    private readonly databaseClient: DatabaseClient,
    private readonly groupAccessRequestMapper: GroupAccessRequestMapper,
    private readonly uuidService: UuidService,
  ) {}

  public async findGroupAccessRequest(payload: FindGroupAccessRequestPayload): Promise<GroupAccessRequest | null> {
    const { id } = payload;

    let rawEntity: GroupAccessRequestRawEntity | undefined;

    try {
      rawEntity = await this.databaseClient<GroupAccessRequestRawEntity>(groupAccessRequestTable)
        .select('*')
        .where({ id })
        .first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'GroupAccessRequest',
        operation: 'find',
        error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.groupAccessRequestMapper.mapToDomain(rawEntity);
  }

  // TODO: add pagination
  public async findGroupAccessRequests(payload: FindGroupAccessRequests): Promise<GroupAccessRequest[]> {
    const { groupId } = payload;

    let rawEntities: GroupAccessRequestRawEntity[];

    try {
      rawEntities = await this.databaseClient<GroupAccessRequestRawEntity>(groupAccessRequestTable)
        .select('*')
        .where({ groupId })
        .orderBy('createdAt', 'desc');
    } catch (error) {
      throw new RepositoryError({
        entity: 'GroupAccessRequest',
        operation: 'find',
        error,
      });
    }

    return rawEntities.map((rawEntity) => this.groupAccessRequestMapper.mapToDomain(rawEntity));
  }

  public async saveGroupAccessRequest(payload: SaveGroupAccessRequestPayload): Promise<GroupAccessRequest> {
    const { groupAccessRequest } = payload;

    let rawEntities: GroupAccessRequestRawEntity[];

    try {
      rawEntities = await this.databaseClient<GroupAccessRequestRawEntity>(groupAccessRequestTable)
        .insert({
          id: this.uuidService.generateUuid(),
          groupId: groupAccessRequest.groupId,
          userId: groupAccessRequest.userId,
          createdAt: new Date(),
        })
        .returning('*');
    } catch (error) {
      throw new RepositoryError({
        entity: 'GroupAccessRequest',
        operation: 'create',
        error,
      });
    }

    const rawEntity = rawEntities[0] as GroupAccessRequestRawEntity;

    return this.groupAccessRequestMapper.mapToDomain(rawEntity);
  }

  public async deleteGroupAccessRequest(payload: DeleteGroupAccessRequestPayload): Promise<void> {
    const { id } = payload;

    try {
      await this.databaseClient<GroupAccessRequestRawEntity>(groupAccessRequestTable).delete().where({ id });
    } catch (error) {
      throw new RepositoryError({
        entity: 'GroupAccessRequest',
        operation: 'delete',
        error,
      });
    }
  }
}
