import { type UserMapper } from './userMapper/userMapper.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { RepositoryError } from '../../../../../common/errors/repositoryError.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type SqliteDatabaseClient } from '../../../../../core/database/sqliteDatabaseClient/sqliteDatabaseClient.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { User, type UserState } from '../../../domain/entities/user/user.js';
import {
  type UserRepository,
  type SaveUserPayload,
  type FindUserPayload,
  type DeleteUserPayload,
} from '../../../domain/repositories/userRepository/userRepository.js';
import { type UserRawEntity } from '../../databases/userDatabase/tables/userTable/userRawEntity.js';
import { UserTable } from '../../databases/userDatabase/tables/userTable/userTable.js';

type CreateUserPayload = { user: UserState };

type UpdateUserPayload = { user: User };

export class UserRepositoryImpl implements UserRepository {
  private readonly userDatabaseTable = new UserTable();

  public constructor(
    private readonly sqliteDatabaseClient: SqliteDatabaseClient,
    private readonly userMapper: UserMapper,
    private readonly uuidService: UuidService,
  ) {}

  public async saveUser(payload: SaveUserPayload): Promise<User> {
    const { user } = payload;

    if (user instanceof User) {
      return this.updateUser({ user });
    }

    return this.createUser({ user });
  }

  private async createUser(payload: CreateUserPayload): Promise<User> {
    const {
      user: { email, password, name, isEmailVerified },
    } = payload;

    let rawEntities: UserRawEntity[];

    const id = this.uuidService.generateUuid();

    try {
      rawEntities = await this.sqliteDatabaseClient<UserRawEntity>(this.userDatabaseTable.name).insert(
        {
          id,
          email,
          password,
          name,
          isEmailVerified,
        },
        '*',
      );
    } catch (error) {
      throw new RepositoryError({
        entity: 'User',
        operation: 'create',
        error,
      });
    }

    const rawEntity = rawEntities[0] as UserRawEntity;

    return this.userMapper.mapToDomain(rawEntity);
  }

  private async updateUser(payload: UpdateUserPayload): Promise<User> {
    const { user } = payload;

    const existingUser = await this.findUser({ id: user.getId() });

    if (!existingUser) {
      throw new ResourceNotFoundError({
        name: 'User',
        id: user.getId(),
      });
    }

    let rawEntities: UserRawEntity[] = [];

    try {
      rawEntities = await this.sqliteDatabaseClient<UserRawEntity>(this.userDatabaseTable.name)
        .update(user.getState(), '*')
        .where({ id: user.getId() });
    } catch (error) {
      throw new RepositoryError({
        entity: 'User',
        operation: 'update',
        error,
      });
    }

    if (!rawEntities.length) {
      return existingUser;
    }

    const rawEntity = rawEntities[0] as UserRawEntity;

    return this.userMapper.mapToDomain(rawEntity);
  }

  public async findUser(payload: FindUserPayload): Promise<User | null> {
    const { id, email } = payload;

    let whereCondition: Partial<UserRawEntity> = {};

    if (!id && !email) {
      throw new OperationNotValidError({
        reason: 'Either id or email must be provided.',
      });
    }

    if (id) {
      whereCondition = {
        ...whereCondition,
        id,
      };
    }

    if (email) {
      whereCondition = {
        ...whereCondition,
        email,
      };
    }

    let rawEntity: UserRawEntity | undefined;

    try {
      rawEntity = await this.sqliteDatabaseClient<UserRawEntity>(this.userDatabaseTable.name)
        .select('*')
        .where(whereCondition)
        .first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'User',
        operation: 'find',
        error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.userMapper.mapToDomain(rawEntity);
  }

  public async deleteUser(payload: DeleteUserPayload): Promise<void> {
    const { id } = payload;

    const existingUser = await this.findUser({ id });

    if (!existingUser) {
      throw new ResourceNotFoundError({
        name: 'User',
        id,
      });
    }

    try {
      await this.sqliteDatabaseClient<UserRawEntity>(this.userDatabaseTable.name).delete().where({ id });
    } catch (error) {
      throw new RepositoryError({
        entity: 'User',
        operation: 'delete',
        error,
      });
    }
  }
}
