import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type UserGroupRawEntity } from '../../../infrastructure/databases/userGroupDatabase/tables/userGroupTable/userGroupRawEntity.js';
import { userGroupTable } from '../../../infrastructure/databases/userGroupDatabase/tables/userGroupTable/userGroupTable.js';
import { UserGroupTestFactory } from '../../factories/userGroupTestFactory/userGroupTestFactory.js';

interface CreateAndPersistPayload {
  readonly input?: Partial<UserGroupRawEntity>;
}

interface FindByIdPayload {
  readonly id: string;
}

interface FindByUserAndGroupPayload {
  readonly userId: string;
  readonly groupId: string;
}

export class UserGroupTestUtils {
  private readonly userGroupTestFactory = new UserGroupTestFactory();

  public constructor(private readonly databaseClient: DatabaseClient) {}

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<UserGroupRawEntity> {
    const { input } = payload;

    const userGroup = this.userGroupTestFactory.createRaw(input);

    const rawEntities = await this.databaseClient<UserGroupRawEntity>(userGroupTable).insert(userGroup, '*');

    return rawEntities[0] as UserGroupRawEntity;
  }

  public async findById(payload: FindByIdPayload): Promise<UserGroupRawEntity> {
    const { id } = payload;

    const userGroupRawEntity = await this.databaseClient<UserGroupRawEntity>(userGroupTable)
      .select('*')
      .where({ id })
      .first();

    return userGroupRawEntity as UserGroupRawEntity;
  }

  public async findByUserAndGroup(payload: FindByUserAndGroupPayload): Promise<UserGroupRawEntity> {
    const { groupId, userId } = payload;

    const userGroupRawEntity = await this.databaseClient<UserGroupRawEntity>(userGroupTable)
      .select('*')
      .where({
        groupId,
        userId,
      })
      .first();

    return userGroupRawEntity as UserGroupRawEntity;
  }

  public async truncate(): Promise<void> {
    await this.databaseClient<UserGroupRawEntity>(userGroupTable).truncate();
  }
}
