import { beforeEach, expect, describe, it } from 'vitest';

import { Generator } from '@common/tests';

import { UserMapperImpl } from './userMapperImpl.js';
import { type UserRawEntity } from '../../../databases/userDatabase/tables/userTable/userRawEntity.js';

describe('UserMapperImpl', () => {
  let userMapperImpl: UserMapperImpl;

  beforeEach(async () => {
    userMapperImpl = new UserMapperImpl();
  });

  it('maps from UserRawEntity to User', async () => {
    const userEntity: UserRawEntity = {
      id: Generator.uuid(),
      email: Generator.email(),
      password: Generator.password(),
      name: Generator.fullName(),
      isEmailVerified: Generator.boolean(),
    };

    const user = userMapperImpl.mapToDomain(userEntity);

    expect(user.getId()).toEqual(userEntity.id);

    expect(user.getState()).toEqual({
      email: userEntity.email,
      password: userEntity.password,
      name: userEntity.name,
      isEmailVerified: userEntity.isEmailVerified,
    });
  });
});
