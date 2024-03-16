import { AddressDatabaseMigrationSource } from './addressDatabaseMigrationSource.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type DependencyInjectionContainer } from '../../../../../libs/dependencyInjection/dependencyInjectionContainer.js';

export class AddressDatabaseManager {
  public static async bootstrapDatabase(container: DependencyInjectionContainer): Promise<void> {
    const databaseClient = container.get<DatabaseClient>(coreSymbols.databaseClient);

    const migrationSource = new AddressDatabaseMigrationSource();

    await databaseClient.migrate.latest({
      migrationSource,
      tableName: migrationSource.getMigrationTableName(),
    });
  }

  public static async teardownDatabase(container: DependencyInjectionContainer): Promise<void> {
    const databaseClient = container.get<DatabaseClient>(coreSymbols.databaseClient);

    const migrationSource = new AddressDatabaseMigrationSource();

    await databaseClient.migrate.rollback({
      migrationSource,
      tableName: migrationSource.getMigrationTableName(),
    });
  }
}
