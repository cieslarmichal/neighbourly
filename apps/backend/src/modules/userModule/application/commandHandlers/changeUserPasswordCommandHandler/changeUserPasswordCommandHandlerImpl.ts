import { type ChangeUserPasswordCommandHandler, type ExecutePayload } from './changeUserPasswordCommandHandler.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.js';
import { type BlacklistTokenRepository } from '../../../domain/repositories/blacklistTokenRepository/blacklistTokenRepository.js';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.js';
import { TokenType } from '../../../domain/types/tokenType.js';
import { type HashService } from '../../services/hashService/hashService.js';
import { type PasswordValidationService } from '../../services/passwordValidationService/passwordValidationService.js';

export class ChangeUserPasswordCommandHandlerImpl implements ChangeUserPasswordCommandHandler {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly blacklistTokenRepository: BlacklistTokenRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    private readonly passwordValidationService: PasswordValidationService,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: ExecutePayload): Promise<void> {
    const { resetPasswordToken, newPassword } = payload;

    let tokenPayload: Record<string, string>;

    try {
      tokenPayload = this.tokenService.verifyToken({ token: resetPasswordToken });
    } catch (error) {
      throw new OperationNotValidError({
        reason: 'Invalid reset password token.',
        token: resetPasswordToken,
      });
    }

    const { userId, type } = tokenPayload;

    this.loggerService.debug({
      message: 'Changing User password...',
      userId,
    });

    if (!userId) {
      throw new OperationNotValidError({
        reason: 'Invalid reset password token.',
        resetPasswordToken,
      });
    }

    if (type !== TokenType.passwordReset) {
      throw new OperationNotValidError({
        reason: 'Invalid reset password token.',
        resetPasswordToken,
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

    const isBlacklisted = await this.blacklistTokenRepository.findBlacklistToken({
      token: resetPasswordToken,
    });

    if (isBlacklisted) {
      throw new OperationNotValidError({
        reason: 'Reset password token is blacklisted.',
        resetPasswordToken,
      });
    }

    this.passwordValidationService.validate({ password: newPassword });

    const hashedPassword = await this.hashService.hash({ plainData: newPassword });

    user.setPassword({ password: hashedPassword });

    await this.userRepository.saveUser({ user });

    const { expiresAt } = this.tokenService.decodeToken({
      token: resetPasswordToken,
    });

    await this.blacklistTokenRepository.createBlacklistToken({
      expiresAt: new Date(expiresAt),
      token: resetPasswordToken,
    });

    this.loggerService.debug({
      message: 'User password changed.',
      userId,
    });
  }
}
