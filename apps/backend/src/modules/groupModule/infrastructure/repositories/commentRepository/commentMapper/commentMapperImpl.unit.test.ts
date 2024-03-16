import { beforeEach, expect, describe, it } from 'vitest';

import { CommentMapperImpl } from './commentMapperImpl.js';
import { CommentTestFactory } from '../../../../tests/factories/commentTestFactory/commentTestFactory.js';

describe('CommentMapperImpl', () => {
  let commentMapperImpl: CommentMapperImpl;

  const commentTestFactory = new CommentTestFactory();

  beforeEach(async () => {
    commentMapperImpl = new CommentMapperImpl();
  });

  it('maps from comment raw entity to domain comment', async () => {
    const commentEntity = commentTestFactory.createRaw();

    const comment = commentMapperImpl.mapToDomain(commentEntity);

    expect(comment).toEqual({
      id: commentEntity.id,
      createdAt: commentEntity.createdAt,
      state: {
        content: commentEntity.content,
        userId: commentEntity.userId,
        postId: commentEntity.postId,
      },
    });
  });

  it('maps from domain comment to comment raw entity', () => {
    const comment = commentTestFactory.create();

    const commentRawEntity = commentMapperImpl.mapToPersistence(comment);

    expect(commentRawEntity).toEqual({
      id: comment.getId(),
      content: comment.getContent(),
      postId: comment.getPostId(),
      userId: comment.getUserId(),
      createdAt: comment.getCreatedAt(),
    });
  });
});
