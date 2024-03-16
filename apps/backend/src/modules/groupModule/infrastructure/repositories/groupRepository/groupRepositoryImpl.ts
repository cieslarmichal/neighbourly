import { type GroupMapper } from './groupMapper/groupMapper.js';
import { RepositoryError } from '../../../../../common/errors/repositoryError.js';
import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { Group, type GroupState } from '../../../domain/entities/group/group.js';
import {
  type FindGroupPayload,
  type GroupRepository,
  type FindGroupsByIds,
  type SaveGroupPayload,
  type DeleteGroupPayload,
  type FindGroupsWithinRadiusPayload,
} from '../../../domain/repositories/groupRepository/groupRepository.js';
import { type GroupRawEntity } from '../../databases/groupDatabase/tables/groupTable/groupRawEntity.js';
import { groupTable } from '../../databases/groupDatabase/tables/groupTable/groupTable.js';

type CreateGroupPayload = { group: GroupState };

type UpdateGroupPayload = { group: Group };

export class GroupRepositoryImpl implements GroupRepository {
  public constructor(
    private readonly databaseClient: DatabaseClient,
    private readonly groupMapper: GroupMapper,
    private readonly uuidService: UuidService,
  ) {}

  public async findAllGroups(): Promise<Group[]> {
    let rawEntities: GroupRawEntity[];

    try {
      rawEntities = await this.databaseClient<GroupRawEntity>(groupTable).select('*');
    } catch (error) {
      throw new RepositoryError({
        entity: 'Group',
        operation: 'find',
        error,
      });
    }

    return rawEntities.map((rawEntity) => this.groupMapper.mapToDomain(rawEntity));
  }

  public async findGroup(payload: FindGroupPayload): Promise<Group | null> {
    const { id, name } = payload;

    let rawEntity: GroupRawEntity | undefined;

    let whereCondition: Partial<GroupRawEntity> = {};

    if (id) {
      whereCondition = {
        ...whereCondition,
        id,
      };
    }

    if (name) {
      whereCondition = {
        ...whereCondition,
        name,
      };
    }

    try {
      rawEntity = await this.databaseClient<GroupRawEntity>(groupTable).select('*').where(whereCondition).first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'Group',
        operation: 'find',
        error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.groupMapper.mapToDomain(rawEntity);
  }

  public async findGroupsByIds(payload: FindGroupsByIds): Promise<Group[]> {
    const { ids } = payload;

    let rawEntities: GroupRawEntity[];

    try {
      rawEntities = await this.databaseClient<GroupRawEntity>(groupTable).select('*').whereIn('id', ids);
    } catch (error) {
      throw new RepositoryError({
        entity: 'Group',
        operation: 'find',
        error,
      });
    }

    return rawEntities.map((rawEntity) => this.groupMapper.mapToDomain(rawEntity));
  }

  public async findGroupsWithinRadius(payload: FindGroupsWithinRadiusPayload): Promise<Group[]> {
    const { latitude, longitude, radius } = payload;

    let rawEntities: GroupRawEntity[];

    try {
      rawEntities = await this.databaseClient<GroupRawEntity>(groupTable)
        .select('groups.id', 'groups.name', 'groups.accessType')
        .join('addresses', (join) => {
          join
            .on('groups.id', '=', 'addresses.groupId')
            .andOn(
              this.databaseClient.raw(`ST_DistanceSphere(addresses.point, ST_SetSRID(ST_MakePoint(?, ?), 4326)) <= ?`, [
                latitude,
                longitude,
                radius,
              ]),
            );
        });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Group',
        operation: 'findGroupsWithinRadius',
        error,
      });
    }

    return rawEntities.map((rawEntity) => this.groupMapper.mapToDomain(rawEntity));
  }

  public async saveGroup(payload: SaveGroupPayload): Promise<Group> {
    const { group } = payload;

    if (group instanceof Group) {
      return this.update({ group });
    }

    return this.create({ group });
  }

  private async create(payload: CreateGroupPayload): Promise<Group> {
    const { group } = payload;

    let rawEntities: GroupRawEntity[];

    try {
      rawEntities = await this.databaseClient<GroupRawEntity>(groupTable)
        .insert({
          id: this.uuidService.generateUuid(),
          ...group,
        })
        .returning('*');
    } catch (error) {
      throw new RepositoryError({
        entity: 'Group',
        operation: 'create',
        error,
      });
    }

    const rawEntity = rawEntities[0] as GroupRawEntity;

    return this.groupMapper.mapToDomain(rawEntity);
  }

  private async update(payload: UpdateGroupPayload): Promise<Group> {
    const { group } = payload;

    let rawEntities: GroupRawEntity[];

    try {
      rawEntities = await this.databaseClient<GroupRawEntity>(groupTable)
        .update(group.getState())
        .where({ id: group.getId() })
        .returning('*');
    } catch (error) {
      throw new RepositoryError({
        entity: 'Group',
        operation: 'update',
        error,
      });
    }

    const rawEntity = rawEntities[0] as GroupRawEntity;

    return this.groupMapper.mapToDomain(rawEntity);
  }

  public async deleteGroup(payload: DeleteGroupPayload): Promise<void> {
    const { id } = payload;

    try {
      await this.databaseClient<GroupRawEntity>(groupTable).delete().where({ id });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Group',
        operation: 'delete',
        error,
      });
    }
  }
}
