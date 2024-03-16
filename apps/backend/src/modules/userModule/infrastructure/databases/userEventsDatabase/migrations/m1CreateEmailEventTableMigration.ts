import { type DatabaseClient } from '../../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type Migration } from '../../../../../../libs/database/types/migration.js';

export class M1CreateEmailEventTableMigration implements Migration {
  public readonly name = 'M1CreateEmailEventTableMigration';

  private readonly tableName = 'emailEvents';

  private readonly tableColumns = {
    id: 'id',
    payload: 'payload',
    eventName: 'eventName',
    status: 'status',
    createdAt: 'createdAt',
  };

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.text(this.tableColumns.id).primary();

      table.text(this.tableColumns.payload).notNullable();

      table.text(this.tableColumns.status).notNullable();

      table.text(this.tableColumns.eventName).notNullable();

      table.dateTime(this.tableColumns.createdAt).notNullable();
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
