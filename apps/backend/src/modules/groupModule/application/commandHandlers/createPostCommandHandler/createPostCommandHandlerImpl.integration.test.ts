import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type CreatePostCommandHandler } from './createPostCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type UserTestUtils } from '../../../../userModule/tests/utils/userTestUtils/userTestUtils.js';
import { symbols } from '../../../symbols.js';
import { type GroupTestUtils } from '../../../tests/utils/groupTestUtils/groupTestUtils.js';
import { type PostTestUtils } from '../../../tests/utils/postTestUtils/postTestUtils.js';

describe('CreatePostCommandHandlerImpl', () => {
  let commandHandler: CreatePostCommandHandler;

  let postTestUtils: PostTestUtils;

  let userTestUtils: UserTestUtils;

  let groupTestUtils: GroupTestUtils;

  beforeEach(async () => {
    const container = TestContainer.create();

    commandHandler = container.get<CreatePostCommandHandler>(symbols.createPostCommandHandler);

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

  it('creates Post', async () => {
    const content = Generator.words(5);

    const user = await userTestUtils.createAndPersist();

    const group = await groupTestUtils.createAndPersist();

    const { post } = await commandHandler.execute({
      content,
      groupId: group.id,
      userId: user.id,
    });

    expect(post.getState()).toEqual({
      content,
      groupId: group.id,
      userId: user.id,
    });

    const persistedPost = await postTestUtils.findById(post.getId());

    expect(persistedPost).not.toBeNull();
  });

  it('throws error - when User was not found', async () => {
    const content = Generator.words(5);

    const group = await groupTestUtils.createAndPersist();

    await expect(async () => {
      await commandHandler.execute({
        content,
        groupId: group.id,
        userId: Generator.uuid(),
      });
    }).toThrowErrorInstance({
      instance: OperationNotValidError,
    });
  });

  it('throws error - when Group was not found', async () => {
    const content = Generator.words(5);

    const user = await userTestUtils.createAndPersist();

    await expect(async () => {
      await commandHandler.execute({
        content,
        groupId: Generator.uuid(),
        userId: user.id,
      });
    }).toThrowErrorInstance({
      instance: OperationNotValidError,
    });
  });
});
