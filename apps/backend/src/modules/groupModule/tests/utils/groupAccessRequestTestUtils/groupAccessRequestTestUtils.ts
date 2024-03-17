import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type GroupAccessRequestRawEntity } from '../../../infrastructure/databases/groupDatabase/tables/groupAccessRequestTable/groupAccessRequestRawEntity.js';
import { groupAccessRequestTable } from '../../../infrastructure/databases/groupDatabase/tables/groupAccessRequestTable/groupAccessRequestTable.js';
import { GroupAccessRequestTestFactory } from '../../factories/groupAccessRequestTestFactory/groupAccessRequestTestFactory.js';

interface CreateAndPersistPayload {
  readonly input?: Partial<GroupAccessRequestRawEntity>;
}

export class GroupAccessRequestTestUtils {
  private readonly groupAccessRequestTestFactory = new GroupAccessRequestTestFactory();

  public constructor(private readonly databaseClient: DatabaseClient) {}

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<GroupAccessRequestRawEntity> {
    const { input } = payload;

    const groupAccessRequest = this.groupAccessRequestTestFactory.createRaw(input);

    const rawEntities = await this.databaseClient<GroupAccessRequestRawEntity>(groupAccessRequestTable).insert(
      {
        id: groupAccessRequest.id,
        groupId: groupAccessRequest.groupId,
        userId: groupAccessRequest.userId,
        createdAt: groupAccessRequest.createdAt,
      },
      '*',
    );

    return rawEntities[0] as GroupAccessRequestRawEntity;
  }

  public async findById(id: string): Promise<GroupAccessRequestRawEntity | null> {
    const group = await this.databaseClient<GroupAccessRequestRawEntity>(groupAccessRequestTable).where({ id }).first();

    return group || null;
  }

  public async truncate(): Promise<void> {
    await this.databaseClient<GroupAccessRequestRawEntity>(groupAccessRequestTable).delete();
  }
}
