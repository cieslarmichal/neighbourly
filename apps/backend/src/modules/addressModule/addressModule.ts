import { AddressHttpController } from './api/httpControllers/addressHttpController/addressHttpController.js';
import { type CreateAddressCommandHandler } from './application/commandHandlers/createAddressCommandHandler/createAddressCommandHandler.js';
import { CreateAddressCommandHandlerImpl } from './application/commandHandlers/createAddressCommandHandler/createAddressCommandHandlerImpl.js';
import { type UpdateAddressCommandHandler } from './application/commandHandlers/updateAddressCommandHandler/updateAddressCommandHandler.js';
import { UpdateAddressCommandHandlerImpl } from './application/commandHandlers/updateAddressCommandHandler/updateAddressCommandHandlerImpl.js';
import { type FindAddressByIdQueryHandler } from './application/queryHandlers/findAddressByIdQueryHandler/findAddressByIdQueryHandler.js';
import { FindAddressByIdQueryHandlerImpl } from './application/queryHandlers/findAddressByIdQueryHandler/findAddressByIdQueryHandlerImpl.js';
import { type AddressMapper } from './domain/mappers/addressMapper.js';
import { type AddressRepository } from './domain/repositories/addressRepository/addressRepository.js';
import { AddressMapperImpl } from './infrastructure/mappers/addressMapperImpl.js';
import { AddressRepositoryImpl } from './infrastructure/repositories/addressRepository/addressRepositoryImpl.js';
import { symbols } from './symbols.js';
import { coreSymbols } from '../../core/symbols.js';
import { type DatabaseClient } from '../../libs/database/clients/databaseClient/databaseClient.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type DependencyInjectionModule } from '../../libs/dependencyInjection/dependencyInjectionModule.js';
import { type UuidService } from '../../libs/uuid/services/uuidService/uuidService.js';
import { type AccessControlService } from '../authModule/application/services/accessControlService/accessControlService.js';
import { authSymbols } from '../authModule/symbols.js';
import { type GroupRepository } from '../groupModule/domain/repositories/groupRepository/groupRepository.js';
import { groupSymbols } from '../groupModule/symbols.js';
import { type UserRepository } from '../userModule/domain/repositories/userRepository/userRepository.js';
import { userSymbols } from '../userModule/symbols.js';

export class AddressModule implements DependencyInjectionModule {
  public declareBindings(container: DependencyInjectionContainer): void {
    container.bind<AddressMapper>(symbols.addressMapper, () => new AddressMapperImpl());

    container.bind<AddressRepository>(
      symbols.addressRepository,
      () =>
        new AddressRepositoryImpl(
          container.get<DatabaseClient>(coreSymbols.databaseClient),
          container.get<AddressMapper>(symbols.addressMapper),
          container.get<UuidService>(coreSymbols.uuidService),
        ),
    );

    container.bind<FindAddressByIdQueryHandler>(
      symbols.findAddressByIdQueryHandler,
      () => new FindAddressByIdQueryHandlerImpl(container.get<AddressRepository>(symbols.addressRepository)),
    );

    container.bind<CreateAddressCommandHandler>(
      symbols.createAddressCommandHandler,
      () =>
        new CreateAddressCommandHandlerImpl(
          container.get<AddressRepository>(symbols.addressRepository),
          container.get<UserRepository>(userSymbols.userRepository),
          container.get<GroupRepository>(groupSymbols.groupRepository),
        ),
    );

    container.bind<UpdateAddressCommandHandler>(
      symbols.updateAddressCommandHandler,
      () => new UpdateAddressCommandHandlerImpl(container.get<AddressRepository>(symbols.addressRepository)),
    );

    container.bind<AddressHttpController>(
      symbols.addressHttpController,
      () =>
        new AddressHttpController(
          container.get<FindAddressByIdQueryHandler>(symbols.findAddressByIdQueryHandler),
          container.get<CreateAddressCommandHandler>(symbols.createAddressCommandHandler),
          container.get<UpdateAddressCommandHandler>(symbols.updateAddressCommandHandler),
          container.get<AccessControlService>(authSymbols.accessControlService),
        ),
    );
  }
}
