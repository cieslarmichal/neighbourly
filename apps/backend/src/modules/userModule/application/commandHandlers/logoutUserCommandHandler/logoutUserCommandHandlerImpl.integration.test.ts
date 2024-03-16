import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { type LogoutUserCommandHandler } from './logoutUserCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type SqliteDatabaseClient } from '../../../../../core/database/sqliteDatabaseClient/sqliteDatabaseClient.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.js';
import { authSymbols } from '../../../../authModule/symbols.js';
import { TokenType } from '../../../domain/types/tokenType.js';
import { symbols } from '../../../symbols.js';
import { type BlacklistTokenTestUtils } from '../../../tests/utils/blacklistTokenTestUtils/blacklistTokenTestUtils.js';
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.js';

describe('LogoutUserCommandHandlerImpl', () => {
  let commandHandler: LogoutUserCommandHandler;

  let sqliteDatabaseClient: SqliteDatabaseClient;

  let tokenService: TokenService;

  let userTestUtils: UserTestUtils;

  let blacklistTokenTestUtils: BlacklistTokenTestUtils;

  beforeEach(() => {
    const container = TestContainer.create();

    commandHandler = container.get<LogoutUserCommandHandler>(symbols.logoutUserCommandHandler);

    sqliteDatabaseClient = container.get<SqliteDatabaseClient>(coreSymbols.sqliteDatabaseClient);

    tokenService = container.get<TokenService>(authSymbols.tokenService);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    blacklistTokenTestUtils = container.get<BlacklistTokenTestUtils>(testSymbols.blacklistTokenTestUtils);
  });

  afterEach(async () => {
    await userTestUtils.truncate();

    await blacklistTokenTestUtils.truncate();

    await sqliteDatabaseClient.destroy();
  });

  it('logs user out', async () => {
    const refreshToken = tokenService.createToken({
      data: {
        type: TokenType.refreshToken,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const accessToken = tokenService.createToken({
      data: {
        type: TokenType.accessToken,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const user = await userTestUtils.createAndPersist();

    await commandHandler.execute({
      userId: user.id,
      refreshToken,
      accessToken,
    });

    const blacklistRefreshToken = await blacklistTokenTestUtils.findByToken({
      token: refreshToken,
    });

    expect(blacklistRefreshToken.token).toEqual(refreshToken);

    const blacklistAccessToken = await blacklistTokenTestUtils.findByToken({
      token: accessToken,
    });

    expect(blacklistAccessToken.token).toEqual(accessToken);
  });

  it('throws an error - when a User with given id not found', async () => {
    const refreshToken = tokenService.createToken({
      data: {
        type: TokenType.refreshToken,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const accessToken = tokenService.createToken({
      data: {
        type: TokenType.accessToken,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const userId = Generator.uuid();

    await expect(
      async () =>
        await commandHandler.execute({
          userId,
          refreshToken,
          accessToken,
        }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'User not found.',
        userId,
      },
    });
  });

  it('throws an error - when RefreshToken is of different purpose', async () => {
    const user = await userTestUtils.createAndPersist();

    const invalidRefreshToken = tokenService.createToken({
      data: {
        invalid: 'true',
        userId: user.id,
        type: TokenType.emailVerification,
      },
      expiresIn: Generator.number(),
    });

    const accessToken = tokenService.createToken({
      data: {
        type: TokenType.accessToken,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    await expect(
      async () =>
        await commandHandler.execute({
          userId: user.id,
          refreshToken: invalidRefreshToken,
          accessToken,
        }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'Invalid refresh token.',
      },
    });
  });

  it('throws an error - when AccessToken is of different purpose', async () => {
    const user = await userTestUtils.createAndPersist();

    const refreshToken = tokenService.createToken({
      data: {
        type: TokenType.refreshToken,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const invalidAccessToken = tokenService.createToken({
      data: {
        invalid: 'true',
        userId: user.id,
        type: TokenType.emailVerification,
      },
      expiresIn: Generator.number(),
    });

    await expect(
      async () =>
        await commandHandler.execute({
          userId: user.id,
          refreshToken,
          accessToken: invalidAccessToken,
        }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'Invalid access token.',
      },
    });
  });
});
