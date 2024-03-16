import { beforeEach, expect, describe, it } from 'vitest';

import { GroupHttpController } from './api/httpControllers/groupHttpController/groupHttpController.js';
import { GroupHttpController } from './api/httpControllers/groupHttpController/groupHttpController.js';
import { groupSymbols } from './symbols.js';
import { Application } from '../../core/application.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';

describe('GroupModule', () => {
  let container: DependencyInjectionContainer;

  beforeEach(async () => {
    container = Application.createContainer();
  });

  it('declares bindings', async () => {
    expect(container.get<GroupHttpController>(groupSymbols.groupHttpController)).toBeInstanceOf(GroupHttpController);

    expect(container.get<GroupHttpController>(groupSymbols.groupHttpController)).toBeInstanceOf(GroupHttpController);
  });
});
