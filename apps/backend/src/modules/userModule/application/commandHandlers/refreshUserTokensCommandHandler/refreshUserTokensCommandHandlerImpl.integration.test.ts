import { beforeEach, expect, it, describe, afterEach } from 'vitest';

import { Generator } from '@common/tests';

import { type RefreshUserTokensCommandHandler } from './refreshUserTokensCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type Config } from '../../../../../core/config.js';
import { type SqliteDatabaseClient } from '../../../../../core/database/sqliteDatabaseClient/sqliteDatabaseClient.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.js';
import { authSymbols } from '../../../../authModule/symbols.js';
import { TokenType } from '../../../domain/types/tokenType.js';
import { symbols } from '../../../symbols.js';
import { type BlacklistTokenTestUtils } from '../../../tests/utils/blacklistTokenTestUtils/blacklistTokenTestUtils.js';
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.js';

describe('RefreshUserTokensCommandHandler', () => {
  let refreshUserTokensCommandHandler: RefreshUserTokensCommandHandler;

  let sqliteDatabaseClient: SqliteDatabaseClient;

  let userTestUtils: UserTestUtils;

  let blacklistTokenTestUtils: BlacklistTokenTestUtils;

  let tokenService: TokenService;

  let config: Config;

  beforeEach(async () => {
    const container = TestContainer.create();

    refreshUserTokensCommandHandler = container.get<RefreshUserTokensCommandHandler>(
      symbols.refreshUserTokensCommandHandler,
    );

    tokenService = container.get<TokenService>(authSymbols.tokenService);

    config = container.get<Config>(coreSymbols.config);

    sqliteDatabaseClient = container.get<SqliteDatabaseClient>(coreSymbols.databaseClient);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    blacklistTokenTestUtils = container.get<BlacklistTokenTestUtils>(testSymbols.blacklistTokenTestUtils);

    await userTestUtils.truncate();

    await blacklistTokenTestUtils.truncate();
  });

  afterEach(async () => {
    await userTestUtils.truncate();

    await blacklistTokenTestUtils.truncate();

    await sqliteDatabaseClient.destroy();
  });

  it('returns new access token', async () => {
    const user = await userTestUtils.createAndPersist();

    const refreshToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: TokenType.refreshToken,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    const result = await refreshUserTokensCommandHandler.execute({
      refreshToken,
    });

    const accessTokenPayload = tokenService.verifyToken({ token: result.accessToken });

    const refreshTokenPayload = tokenService.verifyToken({ token: result.refreshToken });

    expect(accessTokenPayload['userId']).toBe(user.id);

    expect(refreshTokenPayload['userId']).toBe(user.id);

    expect(result.accessTokenExpiresIn).toBe(config.token.access.expiresIn);
  });

  it('throws an error if User does not exist', async () => {
    const userId = Generator.uuid();

    const refreshToken = tokenService.createToken({
      data: {
        userId,
        type: TokenType.refreshToken,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    await expect(async () =>
      refreshUserTokensCommandHandler.execute({
        refreshToken,
      }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'User not found.',
        userId,
      },
    });
  });

  it('throws an error - when token has a different purpose', async () => {
    const user = await userTestUtils.createAndPersist();

    const refreshToken = tokenService.createToken({
      data: {
        userId: user.id,
        type: TokenType.passwordReset,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    await expect(async () =>
      refreshUserTokensCommandHandler.execute({
        refreshToken,
      }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'Token type is not refresh token.',
      },
    });
  });

  it('throws an error if refresh token does not contain userId', async () => {
    const refreshToken = tokenService.createToken({
      data: {
        type: TokenType.refreshToken,
      },
      expiresIn: Generator.number(10000, 100000),
    });

    await expect(async () =>
      refreshUserTokensCommandHandler.execute({
        refreshToken,
      }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'Refresh token does not contain userId.',
      },
    });
  });

  it('throws an error if refresh token is blacklisted', async () => {
    const user = await userTestUtils.createAndPersist();

    const refreshToken = tokenService.createToken({
      data: { userId: user.id },
      expiresIn: Generator.number(10000, 100000),
    });

    await blacklistTokenTestUtils.createAndPersist({ input: { token: refreshToken } });

    await expect(async () =>
      refreshUserTokensCommandHandler.execute({
        refreshToken,
      }),
    ).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'Refresh token is blacklisted.',
      },
    });
  });
});
