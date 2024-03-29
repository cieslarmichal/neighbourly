import { AccessType } from '@common/contracts';
import { Generator } from '@common/tests';

import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type GroupRawEntity } from '../../../infrastructure/databases/groupDatabase/tables/groupTable/groupRawEntity.js';
import { groupTable } from '../../../infrastructure/databases/groupDatabase/tables/groupTable/groupTable.js';

interface CreateAndPersistPayload {
  readonly input?: {
    readonly group?: Partial<GroupRawEntity>;
  };
}

export class GroupTestUtils {
  public constructor(private readonly databaseClient: DatabaseClient) {}

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<GroupRawEntity> {
    const { input } = payload;

    let group: GroupRawEntity;

    if (input?.group?.name) {
      group = {
        id: Generator.uuid(),
        name: input.group.name,
        accessType: AccessType.public,
      };
    } else {
      group = {
        id: Generator.uuid(),
        name: await this.getNonClashingName(),
        accessType: AccessType.public,
        ...input?.group,
      };
    }

    await this.databaseClient<GroupRawEntity>(groupTable).insert(group);

    return group;
  }

  public async findByName(name: string): Promise<GroupRawEntity | null> {
    const group = await this.databaseClient<GroupRawEntity>(groupTable).where({ name }).first();

    return group || null;
  }

  public async findById(id: string): Promise<GroupRawEntity | null> {
    const group = await this.databaseClient<GroupRawEntity>(groupTable).where({ id }).first();

    return group || null;
  }

  public async truncate(): Promise<void> {
    await this.databaseClient<GroupRawEntity>(groupTable).delete();
  }

  public async destroyDatabaseConnection(): Promise<void> {
    await this.databaseClient.destroy();
  }

  private async getNonClashingName(): Promise<string> {
    const name = Generator.word();

    const group = await this.findByName(name);

    if (group) {
      return await this.getNonClashingName();
    }

    return name;
  }
}
