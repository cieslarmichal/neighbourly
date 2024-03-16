import {
  type ExecutePayload,
  type SendResetPasswordEmailCommandHandler,
} from './sendResetPasswordEmailCommandHandler.js';
import { type Config } from '../../../../../core/config.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.js';
import { EmailEventDraft } from '../../../domain/entities/emailEvent/emailEventDraft.ts/emailEventDraft.js';
import { EmailEventType } from '../../../domain/entities/emailEvent/types/emailEventType.js';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.js';
import { TokenType } from '../../../domain/types/tokenType.js';
import { type EmailMessageBus } from '../../messageBuses/emailMessageBus/emailMessageBus.js';

export class SendResetPasswordEmailCommandHandlerImpl implements SendResetPasswordEmailCommandHandler {
  public constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly loggerService: LoggerService,
    private readonly config: Config,
    private readonly emailMessageBus: EmailMessageBus,
  ) {}

  public async execute(payload: ExecutePayload): Promise<void> {
    const { email: emailInput } = payload;

    const email = emailInput.toLowerCase();

    const user = await this.userRepository.findUser({ email });

    if (!user) {
      this.loggerService.debug({
        message: 'User not found.',
        email,
      });

      return;
    }

    this.loggerService.debug({
      message: 'Sending reset password email...',
      userId: user.getId(),
      email: user.getEmail(),
    });

    const resetPasswordToken = this.tokenService.createToken({
      data: {
        userId: user.getId(),
        type: TokenType.passwordReset,
      },
      expiresIn: this.config.token.resetPassword.expiresIn,
    });

    const resetPasswordLink = `${this.config.frontendUrl}/new-password?token=${resetPasswordToken}`;

    await this.emailMessageBus.sendEvent(
      new EmailEventDraft({
        eventName: EmailEventType.resetPassword,
        payload: {
          name: user.getName(),
          recipientEmail: user.getEmail(),
          resetPasswordLink,
        },
      }),
    );
  }
}
