import { beforeEach, expect, describe, it } from 'vitest';

import { UserGroupHttpController } from './api/httpControllers/userGroupHttpController/userGroupHttpController.js';
import { userGroupSymbols } from './symbols.js';
import { Application } from '../../core/application.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';

describe('UserGroupModule', () => {
  let container: DependencyInjectionContainer;

  beforeEach(async () => {
    container = Application.createContainer();
  });

  it('declares bindings', async () => {
    expect(container.get<UserGroupHttpController>(userGroupSymbols.userGroupHttpController)).toBeInstanceOf(
      UserGroupHttpController,
    );
  });
});
