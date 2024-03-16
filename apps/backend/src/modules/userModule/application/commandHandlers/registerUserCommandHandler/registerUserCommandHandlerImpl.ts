import {
  type RegisterUserCommandHandler,
  type RegisterUserCommandHandlerPayload,
  type RegisterUserCommandHandlerResult,
} from './registerUserCommandHandler.js';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/resourceAlreadyExistsError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.js';
import { type HashService } from '../../services/hashService/hashService.js';
import { type PasswordValidationService } from '../../services/passwordValidationService/passwordValidationService.js';
import { type SendVerificationEmailCommandHandler } from '../sendVerificationEmailCommandHandler/sendVerificationEmailCommandHandler.js';

export class RegisterUserCommandHandlerImpl implements RegisterUserCommandHandler {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly loggerService: LoggerService,
    private readonly passwordValidationService: PasswordValidationService,
    private readonly sendVerificationEmailCommandHandler: SendVerificationEmailCommandHandler,
  ) {}

  public async execute(payload: RegisterUserCommandHandlerPayload): Promise<RegisterUserCommandHandlerResult> {
    const { email: emailInput, password, name } = payload;

    const email = emailInput.toLowerCase();

    this.loggerService.debug({
      message: 'Registering User...',
      email,
      name,
    });

    const existingUser = await this.userRepository.findUser({ email });

    if (existingUser) {
      throw new ResourceAlreadyExistsError({
        name: 'User',
        email,
      });
    }

    this.passwordValidationService.validate({ password });

    const hashedPassword = await this.hashService.hash({ plainData: password });

    const user = await this.userRepository.saveUser({
      user: {
        email,
        password: hashedPassword,
        name,
        isEmailVerified: false,
      },
    });

    this.loggerService.debug({
      message: 'User registered.',
      email,
      userId: user.getId(),
    });

    await this.sendVerificationEmailCommandHandler.execute({
      email,
    });

    return { user };
  }
}
