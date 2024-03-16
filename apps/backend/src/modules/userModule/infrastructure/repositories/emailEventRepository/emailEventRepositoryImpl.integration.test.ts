import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Generator } from '@common/tests';

import { testSymbols } from '../../../../../../tests/container/symbols.js';
import { TestContainer } from '../../../../../../tests/container/testContainer.js';
import { EmailEvent } from '../../../domain/entities/emailEvent/emailEvent.js';
import { EmailEventStatus } from '../../../domain/entities/emailEvent/types/emailEventStatus.js';
import { type EmailEventRepository } from '../../../domain/repositories/emailEventRepository/emailEventRepository.js';
import { symbols } from '../../../symbols.js';
import { EmailEventTestFactory } from '../../../tests/factories/emailEventTestFactory/emailEventTestFactory.js';
import { type EmailEventTestUtils } from '../../../tests/utils/emailEventTestUtils/emailEventTestUtils.js';

describe('EmailEventRepositoryImpl', () => {
  let emailEventRepository: EmailEventRepository;

  let emailEventTestUtils: EmailEventTestUtils;

  const emailEventTestFactory = new EmailEventTestFactory();

  beforeEach(() => {
    const container = TestContainer.create();

    emailEventRepository = container.get<EmailEventRepository>(symbols.emailEventRepository);

    emailEventTestUtils = container.get<EmailEventTestUtils>(testSymbols.emailEventTestUtils);
  });

  afterEach(async () => {
    await emailEventTestUtils.truncate();
  });

  describe('findAllCreatedAfter', () => {
    it('returns all EmailEvents created after the given date', async () => {
      const startingDate = new Date();

      const amountOfEmailEvents = Generator.number(10, 50);

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const emailEvents = Array.from({ length: amountOfEmailEvents }).map((_, index) => {
        return emailEventTestFactory.create({
          createdAt: new Date(startingDate.getTime() + (index + 1) * 1000),
          id: Generator.uuid(),
          status: EmailEventStatus.pending,
        });
      });

      await emailEventTestUtils.createMany(emailEvents);

      const foundEmailEvents = await emailEventRepository.findAllCreatedAfter({
        after: startingDate,
      });

      expect(foundEmailEvents.length).toEqual(emailEvents.length);

      foundEmailEvents.forEach((foundEmailEvent) => {
        expect(foundEmailEvent).toBeInstanceOf(EmailEvent);

        expect(foundEmailEvent.getCreatedAt().getTime()).toBeGreaterThanOrEqual(startingDate.getTime());
      });
    });
  });

  describe('findAllPending', () => {
    it('returns all pending EmailEvents', async () => {
      const amountOfEmailEvents = Generator.number(10, 50);

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const emailEvents = Array.from({ length: amountOfEmailEvents }).map(() => {
        return emailEventTestFactory.create({
          status: EmailEventStatus.pending,
        });
      });

      await emailEventTestUtils.createMany(emailEvents);

      const foundEmailEvents = await emailEventRepository.findAllPending();

      expect(foundEmailEvents.length).toEqual(emailEvents.length);

      foundEmailEvents.forEach((foundEmailEvent) => {
        expect(foundEmailEvent).toBeInstanceOf(EmailEvent);

        expect(foundEmailEvent.getStatus()).toEqual(EmailEventStatus.pending);
      });
    });
  });

  describe('updateStatus', () => {
    it('updates the status of the EmailEvent', async () => {
      const emailEvent = emailEventTestFactory.create({
        status: EmailEventStatus.pending,
      });

      await emailEventTestUtils.create(emailEvent);

      await emailEventRepository.updateStatus({
        id: emailEvent.getId(),
        status: EmailEventStatus.processing,
      });

      const foundEmailEvent = await emailEventTestUtils.findById(emailEvent.getId());

      expect(foundEmailEvent).not.toBeNull();

      expect(foundEmailEvent?.status).toEqual(EmailEventStatus.processing);
    });
  });

  describe('deleteProcessed', () => {
    it('deletes all processed EmailEvents', async () => {
      const amountOfEmailEvents = Generator.number(10, 50);

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const emailEvents = Array.from({ length: amountOfEmailEvents }).map(() => {
        return emailEventTestFactory.create({
          status: EmailEventStatus.processed,
        });
      });

      const pendingEmailEvents = Array.from({ length: amountOfEmailEvents }).map(() => {
        return emailEventTestFactory.create({
          status: EmailEventStatus.pending,
        });
      });

      await emailEventTestUtils.createMany([...emailEvents, ...pendingEmailEvents]);

      await emailEventRepository.deleteProcessed();

      const foundEmailEvents = await emailEventTestUtils.findAll();

      expect(foundEmailEvents.length).toEqual(pendingEmailEvents.length);
    });
  });
});
