export const symbols = {
  userMapper: Symbol('userMapper'),
  userRepository: Symbol('userRepository'),
  blacklistTokenMapper: Symbol('blacklistTokenMapper'),
  blacklistTokenRepository: Symbol('blacklistTokenRepository'),

  registerUserCommandHandler: Symbol('registerUserCommandHandler'),
  findUserQueryHandler: Symbol('findUserQueryHandler'),
  loginUserCommandHandler: Symbol('loginUserCommandHandler'),
  refreshUserTokensCommandHandler: Symbol('refreshUserTokensCommandHandler'),
  logoutUserCommandHandler: Symbol('logoutUserCommandHandler'),
  deleteUserCommandHandler: Symbol('deleteUserCommandHandler'),
  sendResetPasswordEmailCommandHandler: Symbol('sendResetPasswordEmailCommandHandler'),
  sendVerificationEmailCommandHandler: Symbol('sendVerificationEmailCommandHandler'),
  changeUserPasswordCommandHandler: Symbol('changeUserPasswordCommandHandler'),
  verifyUserEmailCommandHandler: Symbol('verifyUserEmailCommandHandler'),

  userHttpController: Symbol('userHttpController'),

  emailEventRepository: Symbol('emailEventRepository'),
  emailEventMapper: Symbol('emailEventMapper'),

  emailMessageBus: Symbol('emailMessageBus'),

  findEmailEventsQueryHandler: Symbol('findEmailEventsQueryHandler'),
  changeEmailEventStatusCommandHandler: Symbol('changeEmailEventStatusCommandHandler'),

  emailQueueController: Symbol('emailQueueController'),

  hashService: Symbol('hashService'),
  emailService: Symbol('emailService'),
  passwordValidationService: Symbol('passwordValidationService'),
};

export const userSymbols = {
  userHttpController: symbols.userHttpController,
  userRepository: symbols.userRepository,
  userMapper: symbols.userMapper,
  emailQueueController: symbols.emailQueueController,
};
