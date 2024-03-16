import { type SqliteDatabaseClient } from '../../../../../core/database/sqliteDatabaseClient/sqliteDatabaseClient.js';
import { type EmailEvent } from '../../../domain/entities/emailEvent/emailEvent.js';
import { type EmailEventRawEntity } from '../../../infrastructure/databases/userEventsDatabase/tables/emailEventTable/emailEventRawEntity.js';
import { emailEventTable } from '../../../infrastructure/databases/userEventsDatabase/tables/emailEventTable/emailEventTable.js';

export class EmailEventTestUtils {
  public constructor(private readonly sqliteDatabaseClient: SqliteDatabaseClient) {}

  public async create(emailEvent: EmailEvent): Promise<EmailEventRawEntity> {
    const rawEntities = await this.sqliteDatabaseClient<EmailEventRawEntity>(emailEventTable).insert(
      {
        createdAt: emailEvent.getCreatedAt(),
        id: emailEvent.getId(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payload: JSON.stringify(emailEvent.getPayload()) as any,
        status: emailEvent.getStatus(),
        eventName: emailEvent.getEmailEventName(),
      },
      '*',
    );

    return rawEntities[0] as EmailEventRawEntity;
  }

  public async createMany(emailEvents: EmailEvent[]): Promise<EmailEventRawEntity[]> {
    const rawEntities = await this.sqliteDatabaseClient<EmailEventRawEntity>(emailEventTable).insert(
      emailEvents.map((emailEvent) => ({
        createdAt: emailEvent.getCreatedAt(),
        id: emailEvent.getId(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payload: JSON.stringify(emailEvent.getPayload()) as any,
        status: emailEvent.getStatus(),
        eventName: emailEvent.getEmailEventName(),
      })),
      '*',
    );

    return rawEntities;
  }

  public async findById(id: string): Promise<EmailEventRawEntity | null> {
    const rawEntities = await this.sqliteDatabaseClient<EmailEventRawEntity>(emailEventTable).where({ id }).select('*');

    return rawEntities[0] ?? null;
  }

  public async findAll(): Promise<EmailEventRawEntity[]> {
    return this.sqliteDatabaseClient<EmailEventRawEntity>(emailEventTable).select('*');
  }

  public async truncate(): Promise<void> {
    await this.sqliteDatabaseClient(emailEventTable).truncate();
  }
}
