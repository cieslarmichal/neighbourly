export const symbols = {
  config: Symbol('config'),
  loggerService: Symbol('loggerService'),
  httpService: Symbol('httpService'),
  uuidService: Symbol('uuidService'),
  sqliteDatabaseClient: Symbol('sqliteDatabaseClient'),
  applicationHttpController: Symbol('applicationHttpController'),
  sendGridService: Symbol('sendGridService'),

  entityEventsDatabaseClient: Symbol('entityEventsDatabaseClient'),
};

export const coreSymbols = {
  config: symbols.config,
  loggerService: symbols.loggerService,
  httpService: symbols.httpService,
  uuidService: symbols.uuidService,
  sqliteDatabaseClient: symbols.sqliteDatabaseClient,
  entityEventsDatabaseClient: symbols.entityEventsDatabaseClient,
  sendGridService: symbols.sendGridService,
};
