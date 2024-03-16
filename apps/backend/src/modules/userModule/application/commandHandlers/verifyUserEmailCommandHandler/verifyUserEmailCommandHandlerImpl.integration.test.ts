import { beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type VerifyUserEmailCommandHandler } from './verifyUserEmailCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.js';
import { authSymbols } from '../../../../authModule/symbols.js';
import { TokenType } from '../../../domain/types/tokenType.js';
import { symbols } from '../../../symbols.js';
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.js';

describe('VerifyUserEmailCommandHandlerImpl', () => {
  let commandHandler: VerifyUserEmailCommandHandler;

  let tokenService: TokenService;

  let userTestUtils: UserTestUtils;

  beforeEach(() => {
    const container = TestContainer.create();

    commandHandler = container.get<VerifyUserEmailCommandHandler>(symbols.verifyUserEmailCommandHandler);

    tokenService = container.get<TokenService>(authSymbols.tokenService);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);
  });

  it('verifies user email', async () => {
    const user = await userTestUtils.createAndPersist({ input: { isEmailVerified: false } });

    const emailVerificationToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: TokenType.emailVerification,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    await commandHandler.execute({ emailVerificationToken });

    const updatedUser = await userTestUtils.findById({
      id: user.id,
    });

    expect(updatedUser?.isEmailVerified).toBe(true);
  });

  it('throws an error - when a User with given id not found', async () => {
    const userId = Generator.uuid();

    const emailVerificationToken = tokenService.createToken({
      data: {
        userId,
        type: TokenType.emailVerification,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    await expect(async () => await commandHandler.execute({ emailVerificationToken })).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'User not found.',
        userId,
      },
    });
  });

  it('throws an error - when emailVerificationToken is invalid', async () => {
    const invalidEmailVerificationToken = 'invalidEmailVerificationToken';

    await expect(
      async () => await commandHandler.execute({ emailVerificationToken: invalidEmailVerificationToken }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'Invalid email verification token.',
        token: invalidEmailVerificationToken,
      },
    });
  });

  it('throws an error - when token is not an emailVerification token', async () => {
    const user = await userTestUtils.createAndPersist({ input: { isEmailVerified: false } });

    const invalidEmailVerificationToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: TokenType.refreshToken,
      },
      expiresIn: Generator.number(),
    });

    await expect(
      async () => await commandHandler.execute({ emailVerificationToken: invalidEmailVerificationToken }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'Token type is not email verification token.',
      },
    });
  });

  it('throws an error - when UserTokens were found but emailVerificationToken is expired', async () => {
    const user = await userTestUtils.createAndPersist({ input: { isEmailVerified: false } });

    const emailVerificationToken = tokenService.createToken({
      data: { userId: user.id },
      expiresIn: 0,
    });

    await expect(
      async () =>
        await commandHandler.execute({
          emailVerificationToken,
        }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'Invalid email verification token.',
        token: emailVerificationToken,
      },
    });
  });

  it('throws an error - when User is already verified', async () => {
    const user = await userTestUtils.createAndPersist({ input: { isEmailVerified: true } });

    const emailVerificationToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: TokenType.emailVerification,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    await expect(
      async () =>
        await commandHandler.execute({
          emailVerificationToken,
        }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'User email already verified.',
        email: user.email,
      },
    });
  });
});
