import {
  type VerifyBearerTokenPayload,
  type AccessControlService,
  type VerifyBearerTokenResult,
  type VerifyBasicAuthPayload,
} from './accessControlService.js';
import { type Config } from '../../../../../core/config.js';
import { ForbiddenAccessError } from '../../errors/forbiddenAccessError.js';
import { UnauthorizedAccessError } from '../../errors/unathorizedAccessError.js';
import { type TokenService } from '../tokenService/tokenService.js';

export class AccessControlServiceImpl implements AccessControlService {
  public constructor(
    private readonly tokenService: TokenService,
    private readonly config: Config,
  ) {}

  public async verifyBearerToken(payload: VerifyBearerTokenPayload): Promise<VerifyBearerTokenResult> {
    const { authorizationHeader, expectedUserId } = payload;

    if (!authorizationHeader) {
      throw new UnauthorizedAccessError({
        reason: 'Authorization header not provided.',
      });
    }

    const [authorizationType, token] = authorizationHeader.split(' ');

    if (authorizationType !== 'Bearer') {
      throw new UnauthorizedAccessError({
        reason: 'Bearer authorization type not provided.',
      });
    }

    let tokenPayload;

    try {
      tokenPayload = this.tokenService.verifyToken({ token: token as string });
    } catch (error) {
      throw new UnauthorizedAccessError({
        reason: 'Invalid access token.',
      });
    }

    const accessTokenPayload = tokenPayload as unknown as VerifyBearerTokenResult;

    if (expectedUserId && accessTokenPayload.userId !== expectedUserId) {
      throw new ForbiddenAccessError({
        reason: 'User id does not match User id from token.',
      });
    }

    return accessTokenPayload;
  }

  public verifyBasicAuth(payload: VerifyBasicAuthPayload): void {
    const { authorizationHeader } = payload;

    if (!authorizationHeader) {
      throw new UnauthorizedAccessError({
        reason: 'Authorization header not provided.',
      });
    }

    const [authorizationType, token] = authorizationHeader.split(' ');

    if (authorizationType !== 'Basic' || !token) {
      throw new UnauthorizedAccessError({
        reason: 'Basic authorization type not provided.',
      });
    }

    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');

    const [username, password] = decodedToken.split(':');

    if (!username || !password) {
      throw new UnauthorizedAccessError({
        reason: 'Invalid basic auth token.',
      });
    }

    const adminUsername = this.config.admin.username;

    const adminPassword = this.config.admin.password;

    if (username !== adminUsername || password !== adminPassword) {
      throw new ForbiddenAccessError({
        reason: 'Invalid admin credentials.',
      });
    }
  }
}
