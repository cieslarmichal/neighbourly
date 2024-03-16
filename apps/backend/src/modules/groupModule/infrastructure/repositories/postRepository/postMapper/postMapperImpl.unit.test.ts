import { beforeEach, expect, describe, it } from 'vitest';

import { PostMapperImpl } from './postMapperImpl.js';
import { PostTestFactory } from '../../../../tests/factories/postTestFactory/postTestFactory.js';

describe('PostMapperImpl', () => {
  let postMapperImpl: PostMapperImpl;

  const postTestFactory = new PostTestFactory();

  beforeEach(async () => {
    postMapperImpl = new PostMapperImpl();
  });

  it('maps from post raw entity to domain post', async () => {
    const postEntity = postTestFactory.createRaw();

    const post = postMapperImpl.mapToDomain(postEntity);

    expect(post).toEqual({
      id: postEntity.id,
      createdAt: postEntity.createdAt,
      state: {
        content: postEntity.content,
        userId: postEntity.userId,
        groupId: postEntity.groupId,
      },
    });
  });

  it('maps from domain post to post raw entity', () => {
    const post = postTestFactory.create();

    const postRawEntity = postMapperImpl.mapToPersistence(post);

    expect(postRawEntity).toEqual({
      id: post.getId(),
      content: post.getContent(),
      groupId: post.getGroupId(),
      userId: post.getUserId(),
      createdAt: post.getCreatedAt(),
    });
  });
});
