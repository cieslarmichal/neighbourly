import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type CommentRawEntity } from '../../../infrastructure/databases/groupDatabase/tables/commentTable/commentRawEntity.js';
import { commentTable } from '../../../infrastructure/databases/groupDatabase/tables/commentTable/commentTable.js';
import { CommentTestFactory } from '../../factories/commentTestFactory/commentTestFactory.js';

interface CreateAndPersistPayload {
  readonly input?: Partial<CommentRawEntity>;
}

export class CommentTestUtils {
  private readonly commentTestFactory = new CommentTestFactory();

  public constructor(private readonly databaseClient: DatabaseClient) {}

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<CommentRawEntity> {
    const { input } = payload;

    const comment = this.commentTestFactory.createRaw(input);

    const rawEntities = await this.databaseClient<CommentRawEntity>(commentTable).insert(
      {
        id: comment.id,
        content: comment.id,
        postId: comment.postId,
        userId: comment.userId,
        createdAt: comment.createdAt,
      },
      '*',
    );

    return rawEntities[0] as CommentRawEntity;
  }

  public async findById(id: string): Promise<CommentRawEntity | null> {
    const group = await this.databaseClient<CommentRawEntity>(commentTable).where({ id }).first();

    return group || null;
  }

  public async truncate(): Promise<void> {
    await this.databaseClient<CommentRawEntity>(commentTable).delete();
  }
}
