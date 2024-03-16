import { type DatabaseClient } from '../../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type Migration } from '../../../../../../libs/database/types/migration.js';

export class M2CreatePostTableMigration implements Migration {
  public readonly name = 'M2CreatePostTableMigration';

  private readonly tableName = 'posts';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.text('id').primary();

      table.text('userId').notNullable();

      table.text('groupId').notNullable();

      table.text('content').notNullable();

      table.dateTime('createdAt').notNullable();

      table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');

      table.foreign('groupId').references('id').inTable('groups').onDelete('CASCADE');
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
