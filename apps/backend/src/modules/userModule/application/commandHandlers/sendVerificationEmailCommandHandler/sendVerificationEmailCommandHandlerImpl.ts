import {
  type ExecutePayload,
  type SendVerificationEmailCommandHandler,
} from './sendVerificationEmailCommandHandler.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { type Config } from '../../../../../core/config.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.js';
import { EmailEventDraft } from '../../../domain/entities/emailEvent/emailEventDraft.ts/emailEventDraft.js';
import { EmailEventType } from '../../../domain/entities/emailEvent/types/emailEventType.js';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.js';
import { TokenType } from '../../../domain/types/tokenType.js';
import { type EmailMessageBus } from '../../messageBuses/emailMessageBus/emailMessageBus.js';

export class SendVerificationEmailCommandHandlerImpl implements SendVerificationEmailCommandHandler {
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
      throw new OperationNotValidError({
        reason: 'User not found.',
        email,
      });
    }

    if (user.getIsEmailVerified()) {
      throw new OperationNotValidError({
        reason: 'User email is already verified.',
        email,
      });
    }

    this.loggerService.debug({
      message: 'Sending verification email...',
      userId: user.getId(),
      email: user.getEmail(),
    });

    const emailVerificationToken = this.tokenService.createToken({
      data: {
        userId: user.getId(),
        type: TokenType.emailVerification,
      },
      expiresIn: this.config.token.emailVerification.expiresIn,
    });

    const emailVerificationLink = `${this.config.frontendUrl}/verify-email?token=${emailVerificationToken}`;

    await this.emailMessageBus.sendEvent(
      new EmailEventDraft({
        eventName: EmailEventType.verifyEmail,
        payload: {
          name: user.getName(),
          recipientEmail: user.getEmail(),
          emailVerificationLink,
        },
      }),
    );
  }
}
