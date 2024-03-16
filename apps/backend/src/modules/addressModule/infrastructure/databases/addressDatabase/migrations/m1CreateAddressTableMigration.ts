import { type DatabaseClient } from '../../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type Migration } from '../../../../../../libs/database/types/migration.js';

export class M1CreateAddressTableMigration implements Migration {
  public readonly name = 'M1CreateAddressTableMigration';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.raw(`
        CREATE TABLE "addresses" (
            "id" text PRIMARY KEY,
            "groupId" text,
            "userId" text,
            "street" text NOT NULL,
            "city" text NOT NULL,
            "postalCode" text NOT NULL,
            "point" GEOMETRY(POINT, 4326) NOT NULL
        )
    `);

    await databaseClient.schema.raw(`
        CREATE INDEX "addresses_point_index" ON "addresses" USING GIST("point");
    `);

    await databaseClient.schema.raw(`
        ALTER TABLE "addresses" ADD CONSTRAINT "addresses_groupId_fkey"
        FOREIGN KEY ("groupId") REFERENCES "groups" (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
    `);

    await databaseClient.schema.raw(`
        ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "users" (id)
        ON UPDATE CASCADE ON DELETE CASCADE;
    `);
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable('addresses');
  }
}
