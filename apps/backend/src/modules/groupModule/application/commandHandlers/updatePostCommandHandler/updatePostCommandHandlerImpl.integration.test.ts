import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type UpdatePostCommandHandler } from './updatePostCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { symbols } from '../../../symbols.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';
import { type PostTestUtils } from '../../../tests/utils/postTestUtils/postTestUtils.js';

describe('UpdatePostCommandHandler', () => {
  let commandHandler: UpdatePostCommandHandler;

  let postTestUtils: PostTestUtils;

  let userTestUtils: UserTestUtils;

  let groupTestUtils: GroupTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    commandHandler = container.get<UpdatePostCommandHandler>(symbols.updatePostCommandHandler);

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

  it('throws an error - when Post does not exist', async () => {
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
        name: 'Post',
        id: invalidUuid,
      },
    });
  });

  it('updates Post', async () => {
    const content = Generator.words(5);

    const user = await userTestUtils.createAndPersist();

    const group = await groupTestUtils.createAndPersist();

    const post = await postTestUtils.createAndPersist({
      input: {
        userId: user.id,
        groupId: group.id,
      },
    });

    const { post: updatedPost } = await commandHandler.execute({
      id: post.id,
      content,
    });

    const foundPost = await postTestUtils.findById(post.id);

    expect(updatedPost.getContent()).toEqual(content);

    expect(foundPost?.content).toEqual(content);
  });
});
