import { Generator } from '@common/tests';

import { Comment, type CommentState } from '../../../domain/entities/comment/comment.js';
import { type CommentRawEntity } from '../../../infrastructure/databases/groupDatabase/tables/commentTable/commentRawEntity.js';

export class CommentTestFactory {
  public createRaw(overrides: Partial<CommentRawEntity> = {}): CommentRawEntity {
    return {
      id: Generator.uuid(),
      content: Generator.words(),
      postId: Generator.uuid(),
      userId: Generator.uuid(),
      createdAt: Generator.pastDate(),
      ...overrides,
    };
  }

  public create(overrides: Partial<CommentState> = {}): Comment {
    return new Comment({
      id: Generator.uuid(),
      content: Generator.words(),
      postId: Generator.uuid(),
      userId: Generator.uuid(),
      createdAt: Generator.pastDate(),
      ...overrides,
    });
  }
}
