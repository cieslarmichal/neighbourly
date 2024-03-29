import { type EmailEventMapper } from './mappers/emailEventMapper/emailEventMapper.js';
import { RepositoryError } from '../../../../../common/errors/repositoryError.js';
import { type DatabaseClient } from '../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { type EmailEvent } from '../../../domain/entities/emailEvent/emailEvent.js';
import { type EmailEventDraft } from '../../../domain/entities/emailEvent/emailEventDraft.ts/emailEventDraft.js';
import { EmailEventStatus } from '../../../domain/entities/emailEvent/types/emailEventStatus.js';
import {
  type UpdateStatusPayload,
  type EmailEventRepository,
  type FindAllCreatedAfterPayload,
} from '../../../domain/repositories/emailEventRepository/emailEventRepository.js';
import { type EmailEventRawEntity } from '../../databases/userEventsDatabase/tables/emailEventTable/emailEventRawEntity.js';
import { emailEventTable } from '../../databases/userEventsDatabase/tables/emailEventTable/emailEventTable.js';

export class EmailEventRepositoryImpl implements EmailEventRepository {
  public constructor(
    private readonly databaseClient: DatabaseClient,
    private readonly uuidService: UuidService,
    private readonly emailEventMapper: EmailEventMapper,
  ) {}

  public async findAllCreatedAfter(payload: FindAllCreatedAfterPayload): Promise<EmailEvent[]> {
    const { after } = payload;

    let rawEntities: EmailEventRawEntity[];

    try {
      rawEntities = await this.databaseClient<EmailEventRawEntity>(emailEventTable)
        .where('createdAt', '>=', after)
        .select('*');
    } catch (error) {
      throw new RepositoryError({
        entity: 'EmailEvent',
        operation: 'find',
        error,
      });
    }

    return rawEntities.map((rawEntity) => this.emailEventMapper.map(rawEntity));
  }

  public async findAllPending(): Promise<EmailEvent[]> {
    let rawEntities: EmailEventRawEntity[];

    try {
      rawEntities = await this.databaseClient<EmailEventRawEntity>(emailEventTable)
        .where({ status: EmailEventStatus.pending })
        .select('*');
    } catch (error) {
      throw new RepositoryError({
        entity: 'EmailEvent',
        operation: 'find',
        error,
      });
    }

    return rawEntities.map((rawEntity) => this.emailEventMapper.map(rawEntity));
  }

  public async updateStatus(payload: UpdateStatusPayload): Promise<void> {
    const { id, status } = payload;

    try {
      await this.databaseClient<EmailEventRawEntity>(emailEventTable).where({ id }).update({
        status,
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'EmailEvent',
        operation: 'update',
        error,
      });
    }
  }

  public async create(entity: EmailEventDraft): Promise<void> {
    try {
      await this.databaseClient<EmailEventRawEntity>(emailEventTable).insert({
        createdAt: new Date(),
        id: this.uuidService.generateUuid(),
        payload: JSON.stringify(entity.getPayload()),
        status: EmailEventStatus.pending,
        eventName: entity.getEmailEventName(),
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'EmailEvent',
        operation: 'create',
        error,
      });
    }
  }

  public async deleteProcessed(): Promise<void> {
    try {
      await this.databaseClient<EmailEventRawEntity>(emailEventTable)
        .where({ status: EmailEventStatus.processed })
        .delete();
    } catch (error) {
      throw new RepositoryError({
        entity: 'EmailEvent',
        operation: 'delete',
        error,
      });
    }
  }
}
