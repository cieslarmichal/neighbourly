import { type Static, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import config from 'config';

import { LogLevel } from '../libs/logger/types/logLevel.js';

const configSchema = Type.Object({
  server: Type.Object({
    host: Type.String({ minLength: 1 }),
    port: Type.Number({
      minimum: 1,
      maximum: 65535,
    }),
  }),
  admin: Type.Object({
    username: Type.String({ minLength: 1 }),
    password: Type.String({ minLength: 1 }),
  }),
  logLevel: Type.Enum(LogLevel),
  database: Type.Object({
    databaseName: Type.String({
      minLength: 1,
    }),
    user: Type.String({
      minLength: 1,
    }),
    password: Type.String({
      minLength: 1,
    }),
    host: Type.String({
      minLength: 1,
    }),
  }),
  hashSaltRounds: Type.Number({
    minimum: 5,
    maximum: 15,
  }),
  token: Type.Object({
    secret: Type.String({ minLength: 1 }),
    access: Type.Object({
      expiresIn: Type.Number({ minimum: 3600 }),
    }),
    refresh: Type.Object({
      expiresIn: Type.Number({ minimum: 86400 }),
    }),
    emailVerification: Type.Object({
      expiresIn: Type.Number({ minimum: 3600 }),
    }),
    resetPassword: Type.Object({
      expiresIn: Type.Number({ minimum: 1800 }),
    }),
  }),
  sendGrid: Type.Object({
    apiKey: Type.String({ minLength: 1 }),
    senderEmail: Type.String({ minLength: 1 }),
  }),
  frontendUrl: Type.String({ minLength: 1 }),
  radiusLimit: Type.Number({
    minimum: 1,
  }),
});

export type Config = Static<typeof configSchema>;

export class ConfigFactory {
  public static create(): Config {
    return Value.Decode(configSchema, config);
  }
}
