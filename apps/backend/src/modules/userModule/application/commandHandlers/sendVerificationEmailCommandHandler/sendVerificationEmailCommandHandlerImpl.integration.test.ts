import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Generator, SpyFactory } from '@common/tests';

import { type SendVerificationEmailCommandHandler } from './sendVerificationEmailCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { OperationNotValidError } from '../../../../../common/errors/operationNotValidError.js';
import { EmailEventDraft } from '../../../domain/entities/emailEvent/emailEventDraft.ts/emailEventDraft.js';
import { EmailEventType } from '../../../domain/entities/emailEvent/types/emailEventType.js';
import { symbols } from '../../../symbols.js';
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.js';
import { type EmailMessageBus } from '../../messageBuses/emailMessageBus/emailMessageBus.js';

describe('SendVerificationEmailCommandHandler', () => {
  let commandHandler: SendVerificationEmailCommandHandler;

  let emailMessageBus: EmailMessageBus;

  let userTestUtils: UserTestUtils;

  const spyFactory = new SpyFactory(vi);

  beforeEach(() => {
    const container = TestContainer.create();

    commandHandler = container.get<SendVerificationEmailCommandHandler>(symbols.sendVerificationEmailCommandHandler);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    emailMessageBus = container.get<EmailMessageBus>(symbols.emailMessageBus);
  });

  afterEach(async () => {
    await userTestUtils.truncate();
  });

  it('sends verification email', async () => {
    const user = await userTestUtils.createAndPersist({
      input: {
        isEmailVerified: false,
      },
    });

    const sendEmailSpy = spyFactory.create(emailMessageBus, 'sendEvent');

    await commandHandler.execute({ email: user.email });

    expect(sendEmailSpy).toHaveBeenCalledWith(
      new EmailEventDraft({
        eventName: EmailEventType.verifyEmail,
        payload: {
          recipientEmail: user.email,
          emailVerificationLink: expect.any(String),
          name: user.name,
        },
      }),
    );
  });

  it('throws an error - when user not found', async () => {
    const email = Generator.email();

    await expect(async () => await commandHandler.execute({ email })).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'User not found.',
        email,
      },
    });
  });

  it('throws an error - when user is already verified', async () => {
    const user = await userTestUtils.createAndPersist({
      input: {
        isEmailVerified: true,
      },
    });

    await expect(async () => await commandHandler.execute({ email: user.email })).toThrowErrorInstance({
      instance: OperationNotValidError,
      context: {
        reason: 'User email is already verified.',
        email: user.email,
      },
    });
  });
});
