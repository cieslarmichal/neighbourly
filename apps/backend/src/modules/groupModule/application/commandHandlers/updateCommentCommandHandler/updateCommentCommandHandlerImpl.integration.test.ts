import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type UpdateCommentCommandHandler } from './updateCommentCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { symbols } from '../../../symbols.js';
import { type CommentTestUtils } from '../../../tests/utils/commentTestUtils/commentTestUtils.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';
import { type PostTestUtils } from '../../../tests/utils/postTestUtils/postTestUtils.js';

describe('UpdateCommentCommandHandler', () => {
  let commandHandler: UpdateCommentCommandHandler;

  let commentTestUtils: CommentTestUtils;

  let userTestUtils: UserTestUtils;

  let groupTestUtils: GroupTestUtils;

  let postTestUtils: PostTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    commandHandler = container.get<UpdateCommentCommandHandler>(symbols.updateCommentCommandHandler);

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

  it('throws an error - when Comment does not exist', async () => {
    const invalidUuid = Generator.uuid();

    await expect(
      async () =>
        await commandHandler.execute({
          id: invalidUuid,
          content: Generator.words(2),
        }),
    ).toThrowErrorInstance({
      instance: ResourceNotFoundError,
      context: {
        name: 'Comment',
        id: invalidUuid,
      },
    });
  });

  it('updates Comment', async () => {
    const content = Generator.words(5);

    const user = await userTestUtils.createAndPersist();

    const group = await groupTestUtils.createAndPersist();

    const post = await postTestUtils.createAndPersist({
      input: {
        userId: user.id,
        groupId: group.id,
      },
    });

    const comment = await commentTestUtils.createAndPersist({
      input: {
        userId: user.id,
        postId: post.id,
      },
    });

    const { comment: updatedComment } = await commandHandler.execute({
      id: comment.id,
      content,
    });

    const foundComment = await commentTestUtils.findById(comment.id);

    expect(updatedComment.getContent()).toEqual(content);

    expect(foundComment?.content).toEqual(content);
  });
});
