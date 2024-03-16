import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type PostRawEntity } from '../../../infrastructure/databases/groupDatabase/tables/postTable/postRawEntity.js';
import { postTable } from '../../../infrastructure/databases/groupDatabase/tables/postTable/postTable.js';
import { PostTestFactory } from '../../factories/postTestFactory/postTestFactory.js';

interface CreateAndPersistPayload {
  readonly input?: Partial<PostRawEntity>;
}

export class PostTestUtils {
  private readonly postTestFactory = new PostTestFactory();

  public constructor(private readonly databaseClient: DatabaseClient) {}

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<PostRawEntity> {
    const { input } = payload;

    const post = this.postTestFactory.createRaw(input);

    const rawEntities = await this.databaseClient<PostRawEntity>(postTable).insert(
      {
        id: post.id,
        content: post.id,
        groupId: post.groupId,
        userId: post.userId,
        createdAt: post.createdAt,
      },
      '*',
    );

    return rawEntities[0] as PostRawEntity;
  }

  public async findById(id: string): Promise<PostRawEntity | null> {
    const group = await this.databaseClient<PostRawEntity>(postTable).where({ id }).first();

    return group || null;
  }

  public async truncate(): Promise<void> {
    await this.databaseClient<PostRawEntity>(postTable).delete();
  }
}
