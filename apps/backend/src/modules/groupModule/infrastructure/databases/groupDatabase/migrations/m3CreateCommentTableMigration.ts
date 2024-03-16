import { type DatabaseClient } from '../../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type Migration } from '../../../../../../libs/database/types/migration.js';

export class M3CreateCommentTableMigration implements Migration {
  public readonly name = 'M3CreateCommentTableMigration';

  private readonly tableName = 'comments';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable(this.tableName, (table) => {
      table.text('id').primary();

      table.text('userId').notNullable();

      table.text('postId').notNullable();

      table.text('content').notNullable();

      table.dateTime('createdAt').notNullable();

      table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');

      table.foreign('postId').references('id').inTable('posts').onDelete('CASCADE');
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable(this.tableName);
  }
}
