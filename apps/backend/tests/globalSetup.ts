import { Application } from '../src/core/application.js';
import { GroupDatabaseManager } from '../src/modules/groupModule/infrastructure/databases/groupDatabase/groupDatabaseManager.js';
import { UserDatabaseManager } from '../src/modules/userModule/infrastructure/databases/userDatabase/userDatabaseManager.js';
import { UserEventsDatabaseManager } from '../src/modules/userModule/infrastructure/databases/userEventsDatabase/userEventsDatabaseManager.js';

export async function setup(): Promise<void> {
  try {
    const container = Application.createContainer();

    const eventsDatabaseManagers = [UserEventsDatabaseManager];

    const databaseManagers = [UserDatabaseManager, GroupDatabaseManager];

    for (const databaseManager of databaseManagers) {
      await databaseManager.bootstrapDatabase(container);
    }

    for await (const databaseManager of eventsDatabaseManagers) {
      await databaseManager.bootstrapDatabase(container);
    }

    console.log('Database: migrations run succeed.');
  } catch (error) {
    console.log('Database: migrations run error.');

    console.log(error);

    process.exit(1);
  }
}
