import { type SqliteDatabaseClient } from '../../../../../core/database/sqliteDatabaseClient/sqliteDatabaseClient.js';
import { type UserRawEntity } from '../../../infrastructure/databases/userDatabase/tables/userTable/userRawEntity.js';
import { userTable } from '../../../infrastructure/databases/userDatabase/tables/userTable/userTable.js';
import { UserTestFactory } from '../../factories/userTestFactory/userTestFactory.js';

interface CreateAndPersistPayload {
  readonly input?: Partial<UserRawEntity>;
}

interface PersistPayload {
  readonly user: UserRawEntity;
}

interface FindByEmailPayload {
  readonly email: string;
}

interface FindByIdPayload {
  readonly id: string;
}

export class UserTestUtils {
  private readonly userTestFactory = new UserTestFactory();

  public constructor(private readonly sqliteDatabaseClient: SqliteDatabaseClient) {}

  public async createAndPersist(payload: CreateAndPersistPayload = {}): Promise<UserRawEntity> {
    const { input } = payload;

    const user = this.userTestFactory.create(input);

    const rawEntities = await this.sqliteDatabaseClient<UserRawEntity>(userTable).insert(
      {
        id: user.getId(),
        email: user.getEmail(),
        name: user.getName(),
        password: user.getPassword(),
        isEmailVerified: user.getIsEmailVerified(),
      },
      '*',
    );

    const rawEntity = rawEntities[0] as UserRawEntity;

    return {
      ...rawEntity,
      isEmailVerified: Boolean(rawEntity.isEmailVerified),
    };
  }

  public async persist(payload: PersistPayload): Promise<void> {
    const { user } = payload;

    await this.sqliteDatabaseClient<UserRawEntity>(userTable).insert(user, '*');
  }

  public async findByEmail(payload: FindByEmailPayload): Promise<UserRawEntity | undefined> {
    const { email: emailInput } = payload;

    const email = emailInput.toLowerCase();

    const userRawEntity = await this.sqliteDatabaseClient<UserRawEntity>(userTable)
      .select('*')
      .where({ email })
      .first();

    if (!userRawEntity) {
      return undefined;
    }

    return {
      ...userRawEntity,
      isEmailVerified: Boolean(userRawEntity.isEmailVerified),
    };
  }

  public async findById(payload: FindByIdPayload): Promise<UserRawEntity | undefined> {
    const { id } = payload;

    const userRawEntity = await this.sqliteDatabaseClient<UserRawEntity>(userTable).select('*').where({ id }).first();

    if (!userRawEntity) {
      return undefined;
    }

    return {
      ...userRawEntity,
      isEmailVerified: Boolean(userRawEntity.isEmailVerified),
    };
  }

  public async truncate(): Promise<void> {
    await this.sqliteDatabaseClient<UserRawEntity>(userTable).truncate();
  }
}
