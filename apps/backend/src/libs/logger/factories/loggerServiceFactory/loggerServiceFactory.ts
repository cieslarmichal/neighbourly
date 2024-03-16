import { pino } from 'pino';

import { type LoggerService } from '../../services/loggerService/loggerService.js';
import { LoggerServiceImpl } from '../../services/loggerService/loggerServiceImpl.js';
import { type LogLevel } from '../../types/logLevel.js';

export interface LoggerConfig {
  readonly logLevel: LogLevel;
}

export class LoggerServiceFactory {
  public static create(config: LoggerConfig): LoggerService {
    const loggerClient = pino({
      name: 'Logger',
      level: config.logLevel,
    });

    return new LoggerServiceImpl(loggerClient);
  }
}
