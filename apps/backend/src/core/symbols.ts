export const symbols = {
  config: Symbol('config'),
  loggerService: Symbol('loggerService'),
  httpService: Symbol('httpService'),
  uuidService: Symbol('uuidService'),
  databaseClient: Symbol('databaseClient'),
  applicationHttpController: Symbol('applicationHttpController'),
  sendGridService: Symbol('sendGridService'),

  entityEventsDatabaseClient: Symbol('entityEventsDatabaseClient'),
};

export const coreSymbols = {
  config: symbols.config,
  loggerService: symbols.loggerService,
  httpService: symbols.httpService,
  uuidService: symbols.uuidService,
  databaseClient: symbols.databaseClient,
  entityEventsDatabaseClient: symbols.entityEventsDatabaseClient,
  sendGridService: symbols.sendGridService,
};
