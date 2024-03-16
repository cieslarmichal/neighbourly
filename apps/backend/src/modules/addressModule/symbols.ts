export const symbols = {
  addressRepository: Symbol('addressRepository'),

  findAddressByIdQueryHandler: Symbol('findAddressByIdQueryHandler'),
  createAddressCommandHandler: Symbol('createAddressCommandHandler'),
  updateAddressCommandHandler: Symbol('updateAddressCommandHandler'),

  addressMapper: Symbol('addressMapper'),

  addressHttpController: Symbol('addressHttpController'),
} as const;

export const addressSymbols = {
  addressRepository: symbols.addressRepository,

  addressMapper: symbols.addressMapper,

  addressHttpController: symbols.addressHttpController,
} as const;
