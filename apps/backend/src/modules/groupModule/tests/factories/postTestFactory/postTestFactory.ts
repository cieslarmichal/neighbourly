import { Generator } from '@common/tests';

import { Post, type PostState } from '../../../domain/entities/post/post.js';
import { type PostRawEntity } from '../../../infrastructure/databases/groupDatabase/tables/postTable/postRawEntity.js';

export class PostTestFactory {
  public createRaw(overrides: Partial<PostRawEntity> = {}): PostRawEntity {
    return {
      id: Generator.uuid(),
      content: Generator.words(),
      groupId: Generator.uuid(),
      userId: Generator.uuid(),
      createdAt: Generator.pastDate(),
      ...overrides,
    };
  }

  public create(overrides: Partial<PostState> = {}): Post {
    return new Post({
      id: Generator.uuid(),
      content: Generator.words(),
      groupId: Generator.uuid(),
      userId: Generator.uuid(),
      createdAt: Generator.pastDate(),
      ...overrides,
    });
  }
}
