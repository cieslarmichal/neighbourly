export const symbols = {
  groupMapper: Symbol('groupMapper'),
  groupRepository: Symbol('groupRepository'),

  createGroupCommandHandler: Symbol('createGroupCommandHandler'),
  deleteGroupCommandHandler: Symbol('deleteGroupCommandHandler'),
  updateGroupNameCommandHandler: Symbol('updateGroupNameCommandHandler'),

  findGroupsQueryHandler: Symbol('findGroupsQueryHandler'),
  findGroupByNameQueryHandler: Symbol('findGroupByNameQueryHandler'),
  findGroupByIdQueryHandler: Symbol('findGroupByIdQueryHandler'),

  groupHttpController: Symbol('groupHttpController'),
};

export const groupSymbols = {
  groupHttpController: symbols.groupHttpController,
  groupRepository: symbols.groupRepository,
};
