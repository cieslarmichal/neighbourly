import { beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type ChangeUserPasswordCommandHandler } from './changeUserPasswordCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.js';
import { authSymbols } from '../../../../authModule/symbols.js';
import { TokenType } from '../../../domain/types/tokenType.js';
import { symbols } from '../../../symbols.js';
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.js';
import { type HashService } from '../../services/hashService/hashService.js';

describe('ChangeUserPasswordCommandHandlerImpl', () => {
  let commandHandler: ChangeUserPasswordCommandHandler;

  let tokenService: TokenService;

  let userTestUtils: UserTestUtils;

  let hashService: HashService;

  beforeEach(() => {
    const container = TestContainer.create();

    commandHandler = container.get<ChangeUserPasswordCommandHandler>(symbols.changeUserPasswordCommandHandler);

    tokenService = container.get<TokenService>(authSymbols.tokenService);

    hashService = container.get<HashService>(symbols.hashService);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);
  });

  it('changes user password', async () => {
    const user = await userTestUtils.createAndPersist();

    const resetPasswordToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: TokenType.passwordReset,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const newPassword = Generator.password();

    await commandHandler.execute({
      newPassword,
      resetPasswordToken,
    });

    const updatedUser = await userTestUtils.findById({
      id: user.id,
    });

    const isUpdatedPasswordValid = await hashService.compare({
      plainData: newPassword,
      hashedData: updatedUser?.password as string,
    });

    expect(isUpdatedPasswordValid).toBe(true);
  });

  it('throws an error - when a User with given id not found', async () => {
    const newPassword = Generator.password();

    const userId = Generator.uuid();

    const resetPasswordToken = tokenService.createToken({
      data: {
        userId,
        type: TokenType.passwordReset,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    await expect(
      async () =>
        await commandHandler.execute({
          newPassword,
          resetPasswordToken,
        }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'User not found.',
        userId,
      },
    });
  });

  it('throws an error - when password does not meet the requirements', async () => {
    const user = await userTestUtils.createAndPersist();

    const resetPasswordToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: TokenType.passwordReset,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const newPassword = Generator.alphaString(5);

    await expect(
      async () =>
        await commandHandler.execute({
          newPassword,
          resetPasswordToken,
        }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
    });
  });

  it('throws an error - when resetPasswordToken is invalid', async () => {
    const invalidResetPasswordToken = 'invalidResetPasswordToken';

    const newPassword = Generator.password();

    await expect(
      async () =>
        await commandHandler.execute({
          newPassword,
          resetPasswordToken: invalidResetPasswordToken,
        }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'Invalid reset password token.',
        token: invalidResetPasswordToken,
      },
    });
  });

  it('throws an error - when token is has a different purpose', async () => {
    const user = await userTestUtils.createAndPersist();

    const resetPasswordToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: TokenType.refreshToken,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const newPassword = Generator.password();

    await expect(
      async () =>
        await commandHandler.execute({
          newPassword,
          resetPasswordToken,
        }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'Invalid reset password token.',
      },
    });
  });
});
