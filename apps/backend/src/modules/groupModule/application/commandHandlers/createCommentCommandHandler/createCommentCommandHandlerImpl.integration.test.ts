import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type CreateCommentCommandHandler } from './createCommentCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { symbols } from '../../../symbols.js';
import { type CommentTestUtils } from '../../../tests/utils/commentTestUtils/commentTestUtils.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';
import { type PostTestUtils } from '../../../tests/utils/postTestUtils/postTestUtils.js';

describe('CreateCommentCommandHandlerImpl', () => {
  let commandHandler: CreateCommentCommandHandler;

  let commentTestUtils: CommentTestUtils;

  let userTestUtils: UserTestUtils;

  let groupTestUtils: GroupTestUtils;

  let postTestUtils: PostTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    commandHandler = container.get<CreateCommentCommandHandler>(symbols.createCommentCommandHandler);

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

  it('creates Comment', async () => {
    const content = Generator.words(5);

    const user = await userTestUtils.createAndPersist();

    const group = await groupTestUtils.createAndPersist();

    const post = await postTestUtils.createAndPersist({
      input: {
        userId: user.id,
        groupId: group.id,
      },
    });

    const { comment } = await commandHandler.execute({
      content,
      postId: post.id,
      userId: user.id,
    });

    expect(comment.getState()).toEqual({
      content,
      postId: post.id,
      userId: user.id,
    });

    const persistedComment = await commentTestUtils.findById(comment.getId());

    expect(persistedComment).not.toBeNull();
  });

  it('throws error - when User was not found', async () => {
    const content = Generator.words(5);

    const user = await userTestUtils.createAndPersist();

    const group = await groupTestUtils.createAndPersist();

    const post = await postTestUtils.createAndPersist({
      input: {
        userId: user.id,
        groupId: group.id,
      },
    });

    await expect(async () => {
      await commandHandler.execute({
        content,
        postId: post.id,
        userId: Generator.uuid(),
      });
    }).toThrowErrorInstance({
      instance: OperationNotValidError,
    });
  });

  it('throws error - when Post was not found', async () => {
    const content = Generator.words(5);

    const user = await userTestUtils.createAndPersist();

    await expect(async () => {
      await commandHandler.execute({
        content,
        postId: Generator.uuid(),
        userId: user.id,
      });
    }).toThrowErrorInstance({
      instance: OperationNotValidError,
    });
  });
});
