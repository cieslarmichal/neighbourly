import { type DatabaseClient } from '../../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type Migration } from '../../../../../../libs/database/types/migration.js';

export class M3CreateAddressesTableMigration implements Migration {
  public readonly name = 'M3CreateAddressesTableMigration';

  private readonly tableName = 'addresses';

  private readonly columns = {
    id: 'id',
    country: 'country',
    city: 'city',
    postalCode: 'postalCode',
    streetAddress: 'streetAddress',
    userId: 'userId',
  } as const;

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.text(this.columns.id).primary();

      table.text(this.columns.country).notNullable();

      table.text(this.columns.city).notNullable();

      table.text(this.columns.postalCode).notNullable();

      table.text(this.columns.streetAddress).notNullable();

      table.text(this.columns.userId).notNullable();

      table.foreign(this.columns.userId).references('id').inTable('users').onDelete('CASCADE');
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
