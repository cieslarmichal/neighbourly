import { type UserGroupMapper } from './userGroupMapper/userGroupMapper.js';
import { RepositoryError } from '../../../../../common/errors/repositoryError.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { type Group } from '../../../../groupModule/domain/entities/group/group.js';
import { type GroupRawEntity } from '../../../../groupModule/infrastructure/databases/groupDatabase/tables/groupTable/groupRawEntity.js';
import { groupTable } from '../../../../groupModule/infrastructure/databases/groupDatabase/tables/groupTable/groupTable.js';
import { type GroupMapper } from '../../../../groupModule/infrastructure/repositories/groupRepository/groupMapper/groupMapper.js';
import { type User } from '../../../../userModule/domain/entities/user/user.js';
import { type UserRawEntity } from '../../../../userModule/infrastructure/databases/userDatabase/tables/userTable/userRawEntity.js';
import { userTable } from '../../../../userModule/infrastructure/databases/userDatabase/tables/userTable/userTable.js';
import { type UserMapper } from '../../../../userModule/infrastructure/repositories/userRepository/userMapper/userMapper.js';
import { type UserGroupState, UserGroup } from '../../../domain/entities/userGroup/userGroup.js';
import {
  type UserGroupRepository,
  type DeleteUserGroupPayload,
  type SaveUserGroupPayload,
  type FindUsersPayload,
  type FindUserGroupPayload,
  type FindGroupsPayload,
} from '../../../domain/repositories/userGroupRepository/userGroupRepository.js';
import { type UserGroupRawEntity } from '../../databases/userGroupDatabase/tables/userGroupTable/userGroupRawEntity.js';
import { userGroupTable } from '../../databases/userGroupDatabase/tables/userGroupTable/userGroupTable.js';

type CreateUserGroupPayload = { userGroup: UserGroupState };

type UpdateUserGroupPayload = { userGroup: UserGroup };

type FindUserGroupByIdPayload = { id: string };

export class UserGroupRepositoryImpl implements UserGroupRepository {
  public constructor(
    private readonly databaseClient: DatabaseClient,
    private readonly userGroupMapper: UserGroupMapper,
    private readonly userMapper: UserMapper,
    private readonly groupMapper: GroupMapper,
    private readonly uuidService: UuidService,
  ) {}

  public async saveUserGroup(payload: SaveUserGroupPayload): Promise<UserGroup> {
    const { userGroup } = payload;

    if (userGroup instanceof UserGroup) {
      return this.updateUserGroup({ userGroup });
    }

    return this.createUserGroup({ userGroup });
  }

  private async createUserGroup(payload: CreateUserGroupPayload): Promise<UserGroup> {
    const {
      userGroup: { userId, groupId, role },
    } = payload;

    let rawEntities: UserGroupRawEntity[] = [];

    const id = this.uuidService.generateUuid();

    try {
      rawEntities = await this.databaseClient<UserGroupRawEntity>(userGroupTable).insert(
        {
          id,
          userId,
          groupId,
          role,
        },
        '*',
      );
    } catch (error) {
      throw new RepositoryError({
        entity: 'UserGroup',
        operation: 'create',
        error,
      });
    }

    const rawEntity = rawEntities[0] as UserGroupRawEntity;

    return this.userGroupMapper.mapRawToDomain(rawEntity);
  }

  private async updateUserGroup(payload: UpdateUserGroupPayload): Promise<UserGroup> {
    const { userGroup } = payload;

    const existingUserGroup = await this.findUserGroupById({ id: userGroup.getId() });

    if (!existingUserGroup) {
      throw new ResourceNotFoundError({
        name: 'UserGroup',
        id: userGroup.getId(),
      });
    }

    try {
      await this.databaseClient(userGroupTable).update(userGroup.getState(), '*').where({ id: userGroup.getId() });
    } catch (error) {
      throw new RepositoryError({
        entity: 'UserGroup',
        operation: 'update',
        error,
      });
    }

    return userGroup;
  }

  public async findUserGroup(payload: FindUserGroupPayload): Promise<UserGroup | null> {
    const { groupId, userId } = payload;

    let rawEntity: UserGroupRawEntity | undefined;

    try {
      rawEntity = await this.databaseClient<UserGroupRawEntity>(userGroupTable)
        .select('*')
        .where({
          groupId,
          userId,
        })
        .first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'UserGroup',
        operation: 'find',
        error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.userGroupMapper.mapRawToDomain(rawEntity);
  }

  public async findUserGroupById(payload: FindUserGroupByIdPayload): Promise<UserGroup | null> {
    const { id } = payload;

    let rawEntity: UserGroupRawEntity | undefined;

    try {
      rawEntity = await this.databaseClient<UserGroupRawEntity>(userGroupTable).select('*').where({ id }).first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'UserGroup',
        operation: 'find',
        error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.userGroupMapper.mapRawToDomain(rawEntity);
  }

  public async findUsers(payload: FindUsersPayload): Promise<User[]> {
    const { groupId } = payload;

    let rawEntities: UserRawEntity[];

    try {
      rawEntities = await this.databaseClient<GroupRawEntity>(userGroupTable)
        .select([
          `${userTable}.id as id`,
          `${userTable}.email as email`,
          `${userTable}.password as password`,
          `${userTable}.name as name`,
          `${userTable}.isEmailVerified as isEmailVerified`,
        ])
        .leftJoin(userTable, (join) => {
          join.on(`${userTable}.id`, '=', `${userGroupTable}.userId`);
        })
        .where({ groupId });
    } catch (error) {
      throw new RepositoryError({
        entity: 'UserGroup',
        operation: 'find',
        error,
      });
    }

    return rawEntities.map((rawEntity) => this.userMapper.mapToDomain(rawEntity));
  }

  public async findGroups(payload: FindGroupsPayload): Promise<Group[]> {
    const { userId } = payload;

    let rawEntities: GroupRawEntity[];

    try {
      rawEntities = await this.databaseClient<GroupRawEntity>(userGroupTable)
        .select([`${groupTable}.id as id`, `${groupTable}.name as name`, `${groupTable}.addressId as addressId`])
        .leftJoin(groupTable, (join) => {
          join.on(`${groupTable}.id`, '=', `${userGroupTable}.groupId`);
        })
        .where({ userId });
    } catch (error) {
      throw new RepositoryError({
        entity: 'UserGroup',
        operation: 'find',
        error,
      });
    }

    return rawEntities.map((rawEntity) => this.groupMapper.mapToDomain(rawEntity));
  }

  public async deleteUserGroup(payload: DeleteUserGroupPayload): Promise<void> {
    const { groupId, userId } = payload;

    const existingUserGroup = await this.findUserGroup({
      groupId,
      userId,
    });

    if (!existingUserGroup) {
      throw new ResourceNotFoundError({
        name: 'UserGroup',
        groupId,
        userId,
      });
    }

    try {
      await this.databaseClient<UserGroupRawEntity>(userGroupTable).delete().where({
        groupId,
        userId,
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'UserGroup',
        operation: 'delete',
        error,
      });
    }
  }
}
