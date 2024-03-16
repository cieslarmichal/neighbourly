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
} from '../../../domain/repositories/groupRepository/groupRepository.js';
import { type GroupRawEntity } from '../../databases/groupDatabase/tables/groupTable/groupRawEntity.js';
import { groupTableName } from '../../databases/groupDatabase/tables/groupTable/groupTable.js';

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
      rawEntities = await this.databaseClient<GroupRawEntity>(groupTableName).select('*');
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
      rawEntity = await this.databaseClient<GroupRawEntity>(groupTableName).select('*').where(whereCondition).first();
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
      rawEntities = await this.databaseClient<GroupRawEntity>(groupTableName).select('*').whereIn('id', ids);
    } catch (error) {
      throw new RepositoryError({
        entity: 'Group',
        operation: 'find',
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
      rawEntities = await this.databaseClient<GroupRawEntity>(groupTableName)
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
      rawEntities = await this.databaseClient<GroupRawEntity>(groupTableName)
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
      await this.databaseClient<GroupRawEntity>(groupTableName).delete().where({ id });
    } catch (error) {
      throw new RepositoryError({
        entity: 'Group',
        operation: 'delete',
        error,
      });
    }
  }
}
