import { compare, genSalt, hash } from 'bcrypt';

import { type ComparePayload, type HashPayload, type HashService } from './hashService.js';
import { type Config } from '../../../../../core/config.js';

export class HashServiceImpl implements HashService {
  public constructor(private readonly config: Config) {}

  public async hash(payload: HashPayload): Promise<string> {
    const { plainData } = payload;

    const salt = await genSalt(this.config.hashSaltRounds);

    return hash(plainData, salt);
  }

  public async compare(payload: ComparePayload): Promise<boolean> {
    const { plainData, hashedData } = payload;

    return compare(plainData, hashedData);
  }
}
