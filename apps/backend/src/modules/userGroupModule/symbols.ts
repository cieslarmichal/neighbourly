export const symbols = {
  userGroupMapper: Symbol('userGroupMapper'),
  userGroupRepository: Symbol('userGroupRepository'),

  createUserGroupCommandHandler: Symbol('createUserGroupCommandHandler'),
  deleteUserGroupCommandHandler: Symbol('deleteUserGroupCommandHandler'),
  updateUserGroupCommandHandler: Symbol('updateUserGroupCommandHandler'),

  findUsersByGroupQueryHandler: Symbol('findUsersByGroupQueryHandler'),
  findGroupsByUserQueryHandler: Symbol('findGroupsByUserQueryHandlers'),

  userGroupHttpController: Symbol('userGroupHttpController'),
};

export const userGroupSymbols = {
  userGroupHttpController: symbols.userGroupHttpController,
  userGroupRepository: symbols.userGroupRepository,
};
