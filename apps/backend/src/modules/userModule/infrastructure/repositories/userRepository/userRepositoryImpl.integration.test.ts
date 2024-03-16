import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { Generator } from '@common/tests';

import { RepositoryError } from '../../../../../common/errors/repositoryError.js';
import { ResourceNotFoundError } from '../../../../../common/errors/resourceNotFoundError.js';
import { Application } from '../../../../../core/application.js';
import { type SqliteDatabaseClient } from '../../../../../core/database/sqliteDatabaseClient/sqliteDatabaseClient.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { type UserRepository } from '../../../domain/repositories/userRepository/userRepository.js';
import { symbols } from '../../../symbols.js';
import { UserTestFactory } from '../../../tests/factories/userTestFactory/userTestFactory.js';
import { UserTestUtils } from '../../../tests/utils/userTestUtils/userTestUtils.js';

describe('UserRepositoryImpl', () => {
  let userRepository: UserRepository;

  let sqliteDatabaseClient: SqliteDatabaseClient;

  let userTestUtils: UserTestUtils;

  const userTestFactory = new UserTestFactory();

  beforeEach(async () => {
    const container = Application.createContainer();

    userRepository = container.get<UserRepository>(symbols.userRepository);

    sqliteDatabaseClient = container.get<SqliteDatabaseClient>(coreSymbols.databaseClient);

    userTestUtils = new UserTestUtils(sqliteDatabaseClient);

    await userTestUtils.truncate();
  });

  afterEach(async () => {
    await userTestUtils.truncate();

    await sqliteDatabaseClient.destroy();
  });

  describe('Save', () => {
    it('creates a User', async () => {
      const createdUser = userTestFactory.create();

      const { email, name, password, isEmailVerified } = createdUser.getState();

      const user = await userRepository.saveUser({
        user: {
          email,
          password,
          name,
          isEmailVerified,
        },
      });

      const foundUser = await userTestUtils.findByEmail({ email });

      expect(user.getEmail()).toEqual(email);

      expect(foundUser?.email).toEqual(email);
    });

    it('throws an error when a User with the same email already exists', async () => {
      const existingUser = await userTestUtils.createAndPersist();

      try {
        await userRepository.saveUser({
          user: {
            email: existingUser.email,
            password: existingUser.password,
            name: existingUser.name,
            isEmailVerified: existingUser.isEmailVerified,
          },
        });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        return;
      }

      expect.fail();
    });

    it(`updates User's data`, async () => {
      const userRawEntity = await userTestUtils.createAndPersist();

      const user = userTestFactory.create(userRawEntity);

      const password = Generator.password();

      const name = Generator.fullName();

      const email = Generator.email();

      const isEmailVerified = Generator.boolean();

      user.setPassword({ password });

      user.setName({ name });

      user.setEmail({ email });

      user.setIsEmailVerified({ isEmailVerified });

      const updatedUser = await userRepository.saveUser({
        user,
      });

      const foundUser = await userTestUtils.findById({ id: user.getId() });

      expect(updatedUser.getState()).toEqual({
        email,
        password,
        name,
        isEmailVerified,
      });

      expect(foundUser).toEqual({
        id: user.getId(),
        email,
        password,
        name,
        isEmailVerified,
      });
    });

    it('throws an error if a User with given id does not exist', async () => {
      const user = userTestFactory.create();

      try {
        await userRepository.saveUser({
          user,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ResourceNotFoundError);

        return;
      }

      expect.fail();
    });
  });

  describe('Find', () => {
    it('finds a User by id', async () => {
      const user = await userTestUtils.createAndPersist();

      const foundUser = await userRepository.findUser({ id: user.id });

      expect(foundUser).not.toBeNull();
    });

    it('finds a User by email', async () => {
      const user = await userTestUtils.createAndPersist();

      const foundUser = await userRepository.findUser({ email: user.email });

      expect(foundUser).not.toBeNull();
    });

    it('returns null if a User with given id does not exist', async () => {
      const createdUser = userTestFactory.create();

      const user = await userRepository.findUser({ id: createdUser.getId() });

      expect(user).toBeNull();
    });
  });

  describe('Delete', () => {
    it('deletes a User', async () => {
      const user = await userTestUtils.createAndPersist();

      await userRepository.deleteUser({ id: user.id });

      const foundUser = await userTestUtils.findById({ id: user.id });

      expect(foundUser).toBeUndefined();
    });

    it('throws an error if a User with given id does not exist', async () => {
      const nonExistentUser = userTestFactory.create();

      try {
        await userRepository.deleteUser({ id: nonExistentUser.getId() });
      } catch (error) {
        expect(error).toBeInstanceOf(ResourceNotFoundError);

        return;
      }

      expect.fail();
    });
  });
});
