import { Generator } from '@common/tests';

import { User, type UserDraft } from '../../../domain/entities/user/user.js';

export class UserTestFactory {
  public create(input: Partial<UserDraft> = {}): User {
    return new User({
      id: Generator.uuid(),
      email: Generator.email(),
      password: Generator.password(),
      name: Generator.fullName(),
      isEmailVerified: Generator.boolean(),
      ...input,
    });
  }
}
