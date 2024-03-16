import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SpyFactory } from '@common/tests';

import { type SendResetPasswordEmailCommandHandler } from './sendResetPasswordEmailCommandHandler.js';
import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { EmailEventDraft } from '../../../domain/entities/emailEvent/emailEventDraft.ts/emailEventDraft.js';
import { EmailEventType } from '../../../domain/entities/emailEvent/types/emailEventType.js';
import { symbols } from '../../../symbols.js';
import { UserTestFactory } from '../../../tests/factories/userTestFactory/userTestFactory.js';
import { type UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.js';
import { type EmailMessageBus } from '../../messageBuses/emailMessageBus/emailMessageBus.js';

describe('SendResetPasswordEmailCommandHandler', () => {
  let commandHandler: SendResetPasswordEmailCommandHandler;

  let emailMessageBus: EmailMessageBus;

  let userTestUtils: UserTestUtils;

  const userTestFactory = new UserTestFactory();

  const spyFactory = new SpyFactory(vi);

  beforeEach(() => {
    const container = TestContainer.create();

    commandHandler = container.get<SendResetPasswordEmailCommandHandler>(symbols.sendResetPasswordEmailCommandHandler);

    userTestUtils = container.get<UserTestUtils>(testSymbols.userTestUtils);

    emailMessageBus = container.get<EmailMessageBus>(symbols.emailMessageBus);
  });

  afterEach(async () => {
    await userTestUtils.truncate();
  });

  it('sends ResetPasswordEmail', async () => {
    const user = userTestFactory.create();

    await userTestUtils.createAndPersist({
      input: {
        email: user.getEmail(),
        name: user.getName(),
        id: user.getId(),
        isEmailVerified: true,
        password: user.getPassword(),
      },
    });

    const sendEmailSpy = spyFactory.create(emailMessageBus, 'sendEvent');

    await commandHandler.execute({
      email: user.getEmail(),
    });

    expect(sendEmailSpy).toHaveBeenCalledWith(
      new EmailEventDraft({
        eventName: EmailEventType.resetPassword,
        payload: {
          recipientEmail: user.getEmail(),
          resetPasswordLink: expect.any(String),
          name: user.getName(),
        },
      }),
    );
  });
});
