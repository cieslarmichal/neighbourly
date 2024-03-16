import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { Comment } from '../../../domain/entities/comment/comment.js';
import { type CommentRepository } from '../../../domain/repositories/commentRepository/commentRepository.js';
import { symbols } from '../../../symbols.js';
import { CommentTestFactory } from '../../../tests/factories/commentTestFactory/commentTestFactory.js';
import { type CommentTestUtils } from '../../../tests/utils/commentTestUtils/commentTestUtils.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';
import { type PostTestUtils } from '../../../tests/utils/postTestUtils/postTestUtils.js';

describe('CommentRepositoryImpl', () => {
  let commentRepository: CommentRepository;

  let commentTestUtils: CommentTestUtils;

  let userTestUtils: UserTestUtils;

  let groupTestUtils: GroupTestUtils;

  let postTestUtils: PostTestUtils;

  const commentTestFactory = new CommentTestFactory();

  beforeEach(async () => {
    const container = TestContainer.create();

    commentRepository = container.get<CommentRepository>(symbols.commentRepository);

    commentTestUtils = container.get<CommentTestUtils>(testSymbols.commentTestUtils);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);

    postTestUtils = container.get<PostTestUtils>(testSymbols.postTestUtils);

    await commentTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();

    await postTestUtils.truncate();
  });

  afterEach(async () => {
    await commentTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();

    await postTestUtils.truncate();
  });

  describe('findById', () => {
    it('returns null - when Comment was not found', async () => {
      const res = await commentRepository.findComment({ id: Generator.uuid() });

      expect(res).toBeNull();
    });

    it('returns Comment', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const post = await postTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      const createdComment = await commentTestUtils.createAndPersist({
        input: {
          userId: user.id,
          postId: post.id,
        },
      });

      const comment = await commentRepository.findComment({ id: createdComment.id });

      expect(comment?.getId()).toEqual(createdComment.id);
    });
  });

  describe('findManyByGroup', () => {
    it('returns Comments', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const post = await postTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      await commentTestUtils.createAndPersist({
        input: {
          userId: user.id,
          postId: post.id,
        },
      });

      const comments = await commentRepository.findComments({ postId: post.id });

      expect(comments.length).toBe(1);

      expect(comments[0]?.getPostId()).toBe(post.id);
    });
  });

  describe('Save', () => {
    it('creates Comment', async () => {
      const content = Generator.word();

      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const post = await postTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      const comment = await commentRepository.saveComment({
        comment: {
          content,
          userId: user.id,
          postId: post.id,
        },
      });

      expect(comment).toBeInstanceOf(Comment);

      expect(comment.getState()).toEqual({
        content,
        userId: user.id,
        postId: post.id,
      });

      const foundComment = await commentTestUtils.findById(comment.getId());

      expect(foundComment).toBeDefined();
    });

    it('updates Comment', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const post = await postTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      const commentRawEntity = await commentTestUtils.createAndPersist({
        input: {
          userId: user.id,
          postId: post.id,
        },
      });

      const newContent = Generator.words(2);

      const comment = commentTestFactory.create(commentRawEntity);

      comment.setContent({ content: newContent });

      const upatedComment = await commentRepository.saveComment({
        comment,
      });

      expect(upatedComment).toBeInstanceOf(Comment);

      expect(upatedComment.getContent()).toBe(newContent);

      const persistedComment = await commentTestUtils.findById(commentRawEntity.id);

      expect(persistedComment?.content).toBe(newContent);
    });
  });

  describe('delete', () => {
    it('deletes Comment', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const post = await postTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      const createdComment = await commentTestUtils.createAndPersist({
        input: {
          userId: user.id,
          postId: post.id,
        },
      });

      await commentRepository.deleteComment({ id: createdComment.id });

      const deletedComment = await commentTestUtils.findById(createdComment.id);

      expect(deletedComment).toBeNull();
    });
  });
});
