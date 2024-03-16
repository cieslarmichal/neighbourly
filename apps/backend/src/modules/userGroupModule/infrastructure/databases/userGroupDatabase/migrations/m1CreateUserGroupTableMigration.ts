import { type DatabaseClient } from '../../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type Migration } from '../../../../../../libs/database/types/migration.js';

export class M1CreateUserGroupTableMigration implements Migration {
  public readonly name = 'M1CreateUserGroupTableMigration';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable('userGroups', (table) => {
      table.text('id').notNullable();

      table.text('userId').notNullable();

      table.text('groupId').notNullable();

      table.text('role').notNullable();

      table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');

      table.foreign('groupId').references('id').inTable('groups').onDelete('CASCADE');

      table.unique(['userId', 'groupId']);
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable('userGroups');
  }
}
