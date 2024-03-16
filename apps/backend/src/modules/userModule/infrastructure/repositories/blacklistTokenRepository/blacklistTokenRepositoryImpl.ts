import { type BlacklistTokenMapper } from './blacklistTokenMapper/blacklistTokenMapper.js';
import { RepositoryError } from '../../../../../common/errors/repositoryError.js';
import { type SqliteDatabaseClient } from '../../../../../core/database/sqliteDatabaseClient/sqliteDatabaseClient.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { type BlacklistToken } from '../../../domain/entities/blacklistToken/blacklistToken.js';
import {
  type BlacklistTokenRepository,
  type CreateBlacklistTokenPayload,
  type FindBlacklistTokenPayload,
} from '../../../domain/repositories/blacklistTokenRepository/blacklistTokenRepository.js';
import { type BlacklistTokenRawEntity } from '../../databases/userDatabase/tables/blacklistTokenTable/blacklistTokenRawEntity.js';
import { BlacklistTokenTable } from '../../databases/userDatabase/tables/blacklistTokenTable/blacklistTokenTable.js';

export class BlacklistTokenRepositoryImpl implements BlacklistTokenRepository {
  private readonly blacklistTokenDatabaseTable = new BlacklistTokenTable();

  public constructor(
    private readonly sqliteDatabaseClient: SqliteDatabaseClient,
    private readonly blacklistTokenMapper: BlacklistTokenMapper,
    private readonly uuidService: UuidService,
  ) {}

  public async createBlacklistToken(payload: CreateBlacklistTokenPayload): Promise<BlacklistToken> {
    const { token, expiresAt } = payload;

    let rawEntities: BlacklistTokenRawEntity[];

    try {
      rawEntities = await this.sqliteDatabaseClient<BlacklistTokenRawEntity>(
        this.blacklistTokenDatabaseTable.name,
      ).insert(
        {
          id: this.uuidService.generateUuid(),
          token,
          expiresAt,
        },
        '*',
      );
    } catch (error) {
      throw new RepositoryError({
        entity: 'BlacklistToken',
        operation: 'create',
        error,
      });
    }

    const rawEntity = rawEntities[0] as BlacklistTokenRawEntity;

    return this.blacklistTokenMapper.mapToDomain(rawEntity);
  }

  public async findBlacklistToken(payload: FindBlacklistTokenPayload): Promise<BlacklistToken | null> {
    const { token } = payload;

    let rawEntity: BlacklistTokenRawEntity | undefined;

    try {
      rawEntity = await this.sqliteDatabaseClient<BlacklistTokenRawEntity>(this.blacklistTokenDatabaseTable.name)
        .select('*')
        .where({ token })
        .first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'BlacklistToken',
        operation: 'find',
        error,
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.blacklistTokenMapper.mapToDomain(rawEntity);
  }
}
