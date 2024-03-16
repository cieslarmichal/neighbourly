import { UserHttpController } from './api/httpControllers/userHttpController/userHttpController.js';
import { EmailQueueController } from './api/queueControllers/emailQueueController/emailQueueController.js';
import { type ChangeEmailEventStatusCommandHandler } from './application/commandHandlers/changeEmailEventStatusCommandHandler/changeEmailEventStatusCommandHandler.js';
import { ChangeEmailEventStatusCommandHandlerImpl } from './application/commandHandlers/changeEmailEventStatusCommandHandler/changeEmailEventStatusCommandHandlerImpl.js';
import { type ChangeUserPasswordCommandHandler } from './application/commandHandlers/changeUserPasswordCommandHandler/changeUserPasswordCommandHandler.js';
import { ChangeUserPasswordCommandHandlerImpl } from './application/commandHandlers/changeUserPasswordCommandHandler/changeUserPasswordCommandHandlerImpl.js';
import { type DeleteUserCommandHandler } from './application/commandHandlers/deleteUserCommandHandler/deleteUserCommandHandler.js';
import { DeleteUserCommandHandlerImpl } from './application/commandHandlers/deleteUserCommandHandler/deleteUserCommandHandlerImpl.js';
import { type LoginUserCommandHandler } from './application/commandHandlers/loginUserCommandHandler/loginUserCommandHandler.js';
import { LoginUserCommandHandlerImpl } from './application/commandHandlers/loginUserCommandHandler/loginUserCommandHandlerImpl.js';
import { type LogoutUserCommandHandler } from './application/commandHandlers/logoutUserCommandHandler/logoutUserCommandHandler.js';
import { LogoutUserCommandHandlerImpl } from './application/commandHandlers/logoutUserCommandHandler/logoutUserCommandHandlerImpl.js';
import { type RefreshUserTokensCommandHandler } from './application/commandHandlers/refreshUserTokensCommandHandler/refreshUserTokensCommandHandler.js';
import { RefreshUserTokensCommandHandlerImpl } from './application/commandHandlers/refreshUserTokensCommandHandler/refreshUserTokensCommandHandlerImpl.js';
import { type RegisterUserCommandHandler } from './application/commandHandlers/registerUserCommandHandler/registerUserCommandHandler.js';
import { RegisterUserCommandHandlerImpl } from './application/commandHandlers/registerUserCommandHandler/registerUserCommandHandlerImpl.js';
import { type SendResetPasswordEmailCommandHandler } from './application/commandHandlers/sendResetPasswordEmailCommandHandler/sendResetPasswordEmailCommandHandler.js';
import { SendResetPasswordEmailCommandHandlerImpl } from './application/commandHandlers/sendResetPasswordEmailCommandHandler/sendResetPasswordEmailCommandHandlerImpl.js';
import { type SendVerificationEmailCommandHandler } from './application/commandHandlers/sendVerificationEmailCommandHandler/sendVerificationEmailCommandHandler.js';
import { SendVerificationEmailCommandHandlerImpl } from './application/commandHandlers/sendVerificationEmailCommandHandler/sendVerificationEmailCommandHandlerImpl.js';
import { type VerifyUserEmailCommandHandler } from './application/commandHandlers/verifyUserEmailCommandHandler/verifyUserEmailCommandHandler.js';
import { VerifyUserEmailCommandHandlerImpl } from './application/commandHandlers/verifyUserEmailCommandHandler/verifyUserEmailCommandHandlerImpl.js';
import { type EmailMessageBus } from './application/messageBuses/emailMessageBus/emailMessageBus.js';
import { type FindEmailEventsQueryHandler } from './application/queryHandlers/findEmailEventsQueryHandler/findEmailEventsQueryHandler.js';
import { FindEmailEventsQueryHandlerImpl } from './application/queryHandlers/findEmailEventsQueryHandler/findEmailEventsQueryHandlerImpl.js';
import { type FindUserQueryHandler } from './application/queryHandlers/findUserQueryHandler/findUserQueryHandler.js';
import { FindUserQueryHandlerImpl } from './application/queryHandlers/findUserQueryHandler/findUserQueryHandlerImpl.js';
import { type EmailService } from './application/services/emailService/emailService.js';
import { type HashService } from './application/services/hashService/hashService.js';
import { HashServiceImpl } from './application/services/hashService/hashServiceImpl.js';
import { type PasswordValidationService } from './application/services/passwordValidationService/passwordValidationService.js';
import { PasswordValidationServiceImpl } from './application/services/passwordValidationService/passwordValidationServiceImpl.js';
import { type BlacklistTokenRepository } from './domain/repositories/blacklistTokenRepository/blacklistTokenRepository.js';
import { type EmailEventRepository } from './domain/repositories/emailEventRepository/emailEventRepository.js';
import { type UserRepository } from './domain/repositories/userRepository/userRepository.js';
import { EmailMessageBusImpl } from './infrastructure/messageBuses/emailMessageBus/emailMessageBusImpl.js';
import { type BlacklistTokenMapper } from './infrastructure/repositories/blacklistTokenRepository/blacklistTokenMapper/blacklistTokenMapper.js';
import { BlacklistTokenMapperImpl } from './infrastructure/repositories/blacklistTokenRepository/blacklistTokenMapper/blacklistTokenMapperImpl.js';
import { BlacklistTokenRepositoryImpl } from './infrastructure/repositories/blacklistTokenRepository/blacklistTokenRepositoryImpl.js';
import { EmailEventRepositoryImpl } from './infrastructure/repositories/emailEventRepository/emailEventRepositoryImpl.js';
import { EmailEventMapper } from './infrastructure/repositories/emailEventRepository/mappers/emailEventMapper/emailEventMapper.js';
import { type UserMapper } from './infrastructure/repositories/userRepository/userMapper/userMapper.js';
import { UserMapperImpl } from './infrastructure/repositories/userRepository/userMapper/userMapperImpl.js';
import { UserRepositoryImpl } from './infrastructure/repositories/userRepository/userRepositoryImpl.js';
import { EmailServiceImpl } from './infrastructure/services/emailServiceImpl.js';
import { symbols } from './symbols.js';
import { type Config } from '../../core/config.js';
import { type SqliteDatabaseClient } from '../../core/database/sqliteDatabaseClient/sqliteDatabaseClient.js';
import { coreSymbols } from '../../core/symbols.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type DependencyInjectionModule } from '../../libs/dependencyInjection/dependencyInjectionModule.js';
import { type LoggerService } from '../../libs/logger/services/loggerService/loggerService.js';
import { type SendGridService } from '../../libs/sendGrid/services/sendGridService/sendGridService.js';
import { type UuidService } from '../../libs/uuid/services/uuidService/uuidService.js';
import { type AccessControlService } from '../authModule/application/services/accessControlService/accessControlService.js';
import { type TokenService } from '../authModule/application/services/tokenService/tokenService.js';
import { authSymbols } from '../authModule/symbols.js';

export class UserModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    container.bind<UserMapper>(symbols.userMapper, () => new UserMapperImpl());

    container.bind<UserRepository>(
      symbols.userRepository,
      () =>
        new UserRepositoryImpl(
          container.get<SqliteDatabaseClient>(coreSymbols.sqliteDatabaseClient),
          container.get<UserMapper>(symbols.userMapper),
          container.get<UuidService>(coreSymbols.uuidService),
        ),
    );

    container.bind<BlacklistTokenMapper>(symbols.blacklistTokenMapper, () => new BlacklistTokenMapperImpl());

    container.bind<BlacklistTokenRepository>(
      symbols.blacklistTokenRepository,
      () =>
        new BlacklistTokenRepositoryImpl(
          container.get<SqliteDatabaseClient>(coreSymbols.sqliteDatabaseClient),
          container.get<BlacklistTokenMapper>(symbols.blacklistTokenMapper),
          container.get<UuidService>(coreSymbols.uuidService),
        ),
    );

    container.bind<HashService>(
      symbols.hashService,
      () => new HashServiceImpl(container.get<Config>(coreSymbols.config)),
    );

    container.bind<EmailService>(
      symbols.emailService,
      () => new EmailServiceImpl(container.get<SendGridService>(coreSymbols.sendGridService)),
    );

    container.bind<PasswordValidationService>(
      symbols.passwordValidationService,
      () => new PasswordValidationServiceImpl(),
    );

    container.bind<RegisterUserCommandHandler>(
      symbols.registerUserCommandHandler,
      () =>
        new RegisterUserCommandHandlerImpl(
          container.get<UserRepository>(symbols.userRepository),
          container.get<HashService>(symbols.hashService),
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<PasswordValidationService>(symbols.passwordValidationService),
          container.get<SendVerificationEmailCommandHandler>(symbols.sendVerificationEmailCommandHandler),
        ),
    );

    container.bind<LoginUserCommandHandler>(
      symbols.loginUserCommandHandler,
      () =>
        new LoginUserCommandHandlerImpl(
          container.get<UserRepository>(symbols.userRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<HashService>(symbols.hashService),
          container.get<TokenService>(authSymbols.tokenService),
          container.get<Config>(coreSymbols.config),
        ),
    );

    container.bind<LogoutUserCommandHandler>(
      symbols.logoutUserCommandHandler,
      () =>
        new LogoutUserCommandHandlerImpl(
          container.get<UserRepository>(symbols.userRepository),
          container.get<TokenService>(authSymbols.tokenService),
          container.get<BlacklistTokenRepository>(symbols.blacklistTokenRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<RefreshUserTokensCommandHandler>(
      symbols.refreshUserTokensCommandHandler,
      () =>
        new RefreshUserTokensCommandHandlerImpl(
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<TokenService>(authSymbols.tokenService),
          container.get<Config>(coreSymbols.config),
          container.get<UserRepository>(symbols.userRepository),
          container.get<BlacklistTokenRepository>(symbols.blacklistTokenRepository),
        ),
    );

    container.bind<SendResetPasswordEmailCommandHandler>(
      symbols.sendResetPasswordEmailCommandHandler,
      () =>
        new SendResetPasswordEmailCommandHandlerImpl(
          container.get<TokenService>(authSymbols.tokenService),
          container.get<UserRepository>(symbols.userRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<Config>(coreSymbols.config),
          container.get<EmailMessageBus>(symbols.emailMessageBus),
        ),
    );

    container.bind<ChangeUserPasswordCommandHandler>(
      symbols.changeUserPasswordCommandHandler,
      () =>
        new ChangeUserPasswordCommandHandlerImpl(
          container.get<UserRepository>(symbols.userRepository),
          container.get<BlacklistTokenRepository>(symbols.blacklistTokenRepository),
          container.get<HashService>(symbols.hashService),
          container.get<TokenService>(authSymbols.tokenService),
          container.get<PasswordValidationService>(symbols.passwordValidationService),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<DeleteUserCommandHandler>(
      symbols.deleteUserCommandHandler,
      () =>
        new DeleteUserCommandHandlerImpl(
          container.get<UserRepository>(symbols.userRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<FindUserQueryHandler>(
      symbols.findUserQueryHandler,
      () => new FindUserQueryHandlerImpl(container.get<UserRepository>(symbols.userRepository)),
    );

    container.bind<SendVerificationEmailCommandHandler>(
      symbols.sendVerificationEmailCommandHandler,
      () =>
        new SendVerificationEmailCommandHandlerImpl(
          container.get<TokenService>(authSymbols.tokenService),
          container.get<UserRepository>(symbols.userRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<Config>(coreSymbols.config),
          container.get<EmailMessageBus>(symbols.emailMessageBus),
        ),
    );

    container.bind<VerifyUserEmailCommandHandler>(
      symbols.verifyUserEmailCommandHandler,
      () =>
        new VerifyUserEmailCommandHandlerImpl(
          container.get<TokenService>(authSymbols.tokenService),
          container.get<UserRepository>(symbols.userRepository),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );

    container.bind<UserHttpController>(
      symbols.userHttpController,
      () =>
        new UserHttpController(
          container.get<RegisterUserCommandHandler>(symbols.registerUserCommandHandler),
          container.get<LoginUserCommandHandler>(symbols.loginUserCommandHandler),
          container.get<DeleteUserCommandHandler>(symbols.deleteUserCommandHandler),
          container.get<FindUserQueryHandler>(symbols.findUserQueryHandler),
          container.get<AccessControlService>(authSymbols.accessControlService),
          container.get<VerifyUserEmailCommandHandler>(symbols.verifyUserEmailCommandHandler),
          container.get<SendResetPasswordEmailCommandHandler>(symbols.sendResetPasswordEmailCommandHandler),
          container.get<ChangeUserPasswordCommandHandler>(symbols.changeUserPasswordCommandHandler),
          container.get<LogoutUserCommandHandler>(symbols.logoutUserCommandHandler),
          container.get<RefreshUserTokensCommandHandler>(symbols.refreshUserTokensCommandHandler),
          container.get<SendVerificationEmailCommandHandler>(symbols.sendVerificationEmailCommandHandler),
        ),
    );

    container.bind<EmailEventMapper>(symbols.emailEventMapper, () => new EmailEventMapper());

    container.bind<EmailEventRepository>(
      symbols.emailEventRepository,
      () =>
        new EmailEventRepositoryImpl(
          container.get<SqliteDatabaseClient>(coreSymbols.entityEventsDatabaseClient),
          container.get<UuidService>(coreSymbols.uuidService),
          container.get<EmailEventMapper>(symbols.emailEventMapper),
        ),
    );

    container.bind<EmailMessageBus>(
      symbols.emailMessageBus,
      () => new EmailMessageBusImpl(container.get<EmailEventRepository>(symbols.emailEventRepository)),
    );

    container.bind<ChangeEmailEventStatusCommandHandler>(
      symbols.changeEmailEventStatusCommandHandler,
      () =>
        new ChangeEmailEventStatusCommandHandlerImpl(container.get<EmailEventRepository>(symbols.emailEventRepository)),
    );

    container.bind<FindEmailEventsQueryHandler>(
      symbols.findEmailEventsQueryHandler,
      () => new FindEmailEventsQueryHandlerImpl(container.get<EmailEventRepository>(symbols.emailEventRepository)),
    );

    container.bind<EmailQueueController>(
      symbols.emailQueueController,
      () =>
        new EmailQueueController(
          container.get<FindEmailEventsQueryHandler>(symbols.findEmailEventsQueryHandler),
          container.get<ChangeEmailEventStatusCommandHandler>(symbols.changeEmailEventStatusCommandHandler),
          container.get<EmailService>(symbols.emailService),
          container.get<LoggerService>(coreSymbols.loggerService),
        ),
    );
  }
}
