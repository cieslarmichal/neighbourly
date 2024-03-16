import { M1CreateGroupTableMigration } from './migrations/m1CreateGroupTableMigration.js';
import { M2CreatePostTableMigration } from './migrations/m2CreatePostTableMigration.js';
import { type Migration } from '../../../../../libs/database/types/migration.js';
import { type MigrationSource } from '../../../../../libs/database/types/migrationSource.js';

export class GroupDatabaseMigrationSource implements MigrationSource {
  public async getMigrations(): Promise<Migration[]> {
    return [new M1CreateGroupTableMigration(), new M2CreatePostTableMigration()];
  }

  public getMigrationName(migration: Migration): string {
    return migration.name;
  }

  public async getMigration(migration: Migration): Promise<Migration> {
    return migration;
  }

  public getMigrationTableName(): string {
    return 'groupDatabaseMigrations';
  }
}
