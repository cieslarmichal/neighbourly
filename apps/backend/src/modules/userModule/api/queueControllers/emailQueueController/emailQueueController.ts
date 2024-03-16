import { ExponentialBackoff, type IDisposable, handleAll, retry } from 'cockatiel';

import { type QueueMessagePayload, type QueueChannel } from '../../../../../common/types/queue/queueChannel.js';
import { type QueueController } from '../../../../../common/types/queue/queueController.js';
import { type QueueHandler } from '../../../../../common/types/queue/queueHandler.js';
import { QueuePath } from '../../../../../common/types/queue/queuePath.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type ChangeEmailEventStatusCommandHandler } from '../../../application/commandHandlers/changeEmailEventStatusCommandHandler/changeEmailEventStatusCommandHandler.js';
import {
  ResetPasswordEmail,
  type ResetPasswordEmailTemplateData,
} from '../../../application/emails/resetPasswordEmail.js';
import {
  VerificationEmail,
  type VerificationEmailTemplateData,
} from '../../../application/emails/verificationEmail.js';
import { type FindEmailEventsQueryHandler } from '../../../application/queryHandlers/findEmailEventsQueryHandler/findEmailEventsQueryHandler.js';
import { type EmailService } from '../../../application/services/emailService/emailService.js';
import { type EmailEvent } from '../../../domain/entities/emailEvent/emailEvent.js';
import { EmailEventStatus } from '../../../domain/entities/emailEvent/types/emailEventStatus.js';
import { EmailEventType } from '../../../domain/entities/emailEvent/types/emailEventType.js';

interface ProcessEmailEventPayload {
  data: EmailEvent;
  eventName: string;
}

export class EmailQueueController implements QueueController {
  public constructor(
    private readonly findEmailEventsQueryHandler: FindEmailEventsQueryHandler,
    private readonly changeEmailEventStatusCommandHandler: ChangeEmailEventStatusCommandHandler,
    private readonly emailService: EmailService,
    private readonly loggerService: LoggerService,
  ) {}

  private eventName = 'email';

  private retryPolicy = retry(handleAll, {
    backoff: new ExponentialBackoff({
      exponent: 2,
      initialDelay: 1000,
    }),
    maxAttempts: 3,
  });

  public getQueuePaths(): QueuePath[] {
    return [
      QueuePath.create({
        handler: this.processEmailEvent.bind(this) as unknown as QueueHandler,
        queuePath: this.eventName,
      }),
    ];
  }

  public getChannels(): QueueChannel[] {
    return [
      {
        getMessages: async (): Promise<QueueMessagePayload[]> => {
          const { emailEvents } = await this.findEmailEventsQueryHandler.execute();

          return emailEvents.map((emailEvent) => ({
            data: emailEvent as unknown as Record<string, unknown>,
            eventName: this.eventName,
          }));
        },
      },
    ];
  }

  private async processEmailEvent(payload: ProcessEmailEventPayload): Promise<void> {
    const { data: emailEvent } = payload;

    let retryListener: IDisposable;

    switch (emailEvent.getEmailEventName()) {
      case EmailEventType.verifyEmail:
        const verificationEmail = new VerificationEmail({
          recipient: emailEvent.getRecipientEmail(),
          templateData: emailEvent.getPayload() as unknown as VerificationEmailTemplateData,
        });

        await this.changeEmailEventStatusCommandHandler.execute({
          id: emailEvent.getId(),
          status: EmailEventStatus.processing,
        });

        retryListener = this.retryPolicy.onFailure((reason) => {
          this.loggerService.error({
            message: 'Failed to send verification email.',
            emailEventId: emailEvent.getId(),
            reason,
          });
        });

        try {
          await this.retryPolicy.execute(async () => {
            await this.emailService.sendEmail(verificationEmail);

            this.loggerService.debug({
              message: 'Sent verification email.',
              emailEventId: emailEvent.getId(),
              recipient: emailEvent.getRecipientEmail(),
            });
          });
        } catch (error) {
          await this.changeEmailEventStatusCommandHandler.execute({
            id: emailEvent.getId(),
            status: EmailEventStatus.failed,
          });

          retryListener.dispose();

          throw error;
        }

        retryListener.dispose();

        await this.changeEmailEventStatusCommandHandler.execute({
          id: emailEvent.getId(),
          status: EmailEventStatus.processed,
        });

        break;

      case EmailEventType.resetPassword:
        const resetPasswordEmail = new ResetPasswordEmail({
          recipient: emailEvent.getRecipientEmail(),
          templateData: emailEvent.getPayload() as unknown as ResetPasswordEmailTemplateData,
        });

        retryListener = this.retryPolicy.onFailure((reason) => {
          this.loggerService.error({
            message: 'Failed to send reset password email.',
            emailEventId: emailEvent.getId(),
            reason,
          });
        });

        await this.changeEmailEventStatusCommandHandler.execute({
          id: emailEvent.getId(),
          status: EmailEventStatus.processing,
        });

        try {
          await this.retryPolicy.execute(async () => {
            await this.emailService.sendEmail(resetPasswordEmail);

            this.loggerService.debug({
              message: 'Sent reset password email.',
              emailEventId: emailEvent.getId(),
              recipient: emailEvent.getRecipientEmail(),
            });
          });
        } catch (error) {
          await this.changeEmailEventStatusCommandHandler.execute({
            id: emailEvent.getId(),
            status: EmailEventStatus.failed,
          });

          retryListener.dispose();

          throw error;
        }

        retryListener.dispose();

        await this.changeEmailEventStatusCommandHandler.execute({
          id: emailEvent.getId(),
          status: EmailEventStatus.processed,
        });

        break;
    }
  }
}
