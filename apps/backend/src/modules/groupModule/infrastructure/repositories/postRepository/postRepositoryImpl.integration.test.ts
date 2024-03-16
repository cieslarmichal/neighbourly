import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { Post } from '../../../domain/entities/post/post.js';
import { type PostRepository } from '../../../domain/repositories/postRepository/postRepository.js';
import { symbols } from '../../../symbols.js';
import { PostTestFactory } from '../../../tests/factories/postTestFactory/postTestFactory.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';
import { type PostTestUtils } from '../../../tests/utils/postTestUtils/postTestUtils.js';

describe('PostRepositoryImpl', () => {
  let postRepository: PostRepository;

  let postTestUtils: PostTestUtils;

  let userTestUtils: UserTestUtils;

  let groupTestUtils: GroupTestUtils;

  const postTestFactory = new PostTestFactory();

  beforeEach(async () => {
    const container = TestContainer.create();

    postRepository = container.get<PostRepository>(symbols.postRepository);

    postTestUtils = container.get<PostTestUtils>(testSymbols.postTestUtils);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    groupTestUtils = container.get<GroupTestUtils>(testSymbols.groupTestUtils);

    await postTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();
  });

  afterEach(async () => {
    await postTestUtils.truncate();

    await userTestUtils.truncate();

    await groupTestUtils.truncate();
  });

  describe('findById', () => {
    it('returns null - when Post was not found', async () => {
      const res = await postRepository.findPost({ id: Generator.uuid() });

      expect(res).toBeNull();
    });

    it('returns Post', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const createdPost = await postTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      const post = await postRepository.findPost({ id: createdPost.id });

      expect(post?.getId()).toEqual(createdPost.id);
    });
  });

  describe('findManyByGroup', () => {
    it('returns Posts', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      await postTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      const posts = await postRepository.findPosts({ groupId: group.id });

      expect(posts.length).toBe(1);

      expect(posts[0]?.getGroupId()).toBe(group.id);
    });
  });

  describe('Save', () => {
    it('creates Post', async () => {
      const content = Generator.word();

      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const post = await postRepository.savePost({
        post: {
          content,
          userId: user.id,
          groupId: group.id,
        },
      });

      expect(post).toBeInstanceOf(Post);

      expect(post.getState()).toEqual({
        content,
        userId: user.id,
        groupId: group.id,
      });

      const foundPost = await postTestUtils.findById(post.getId());

      expect(foundPost).toBeDefined();
    });

    it('updates Post', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const postRawEntity = await postTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      const newContent = Generator.words(2);

      const post = postTestFactory.create(postRawEntity);

      post.setContent({ content: newContent });

      const upatedPost = await postRepository.savePost({
        post,
      });

      expect(upatedPost).toBeInstanceOf(Post);

      expect(upatedPost.getContent()).toBe(newContent);

      const persistedPost = await postTestUtils.findById(postRawEntity.id);

      expect(persistedPost?.content).toBe(newContent);
    });
  });

  describe('delete', () => {
    it('deletes Post', async () => {
      const user = await userTestUtils.createAndPersist();

      const group = await groupTestUtils.createAndPersist();

      const createdPost = await postTestUtils.createAndPersist({
        input: {
          userId: user.id,
          groupId: group.id,
        },
      });

      await postRepository.deletePost({ id: createdPost.id });

      const deletedPost = await postTestUtils.findById(createdPost.id);

      expect(deletedPost).toBeNull();
    });
  });
});
