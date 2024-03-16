import { type VerifyUserEmailCommandHandler, type ExecutePayload } from './verifyUserEmailCommandHandler.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.js';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.js';
import { TokenType } from '../../../domain/types/tokenType.js';

export class VerifyUserEmailCommandHandlerImpl implements VerifyUserEmailCommandHandler {
  public constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: ExecutePayload): Promise<void> {
    const { emailVerificationToken } = payload;

    let tokenPayload: Record<string, string>;

    try {
      tokenPayload = this.tokenService.verifyToken({ token: emailVerificationToken });
    } catch (error) {
      throw new OperationNotValidError({
        reason: 'Invalid email verification token.',
        token: emailVerificationToken,
      });
    }

    const userId = tokenPayload['userId'];

    if (!userId) {
      throw new OperationNotValidError({
        reason: 'User ID not found in token payload.',
      });
    }

    if (tokenPayload['type'] !== TokenType.emailVerification) {
      throw new OperationNotValidError({
        reason: 'Token type is not email verification token.',
      });
    }

    const user = await this.userRepository.findUser({
      id: userId,
    });

    if (!user) {
      throw new OperationNotValidError({
        reason: 'User not found.',
        userId,
      });
    }

    this.loggerService.debug({
      message: 'Verifying user email...',
      userId: user.getId(),
      email: user.getEmail(),
    });

    if (user.getIsEmailVerified()) {
      throw new OperationNotValidError({
        reason: 'User email already verified.',
        email: user.getEmail(),
      });
    }

    user.setIsEmailVerified({ isEmailVerified: true });

    await this.userRepository.saveUser({ user });

    this.loggerService.debug({
      message: 'User email verified.',
      userId: user.getId(),
      email: user.getEmail(),
    });
  }
}
